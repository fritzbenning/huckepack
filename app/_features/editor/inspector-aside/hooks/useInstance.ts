import type { ComponentProp } from "@editor/layer-tree";
import { updateComponentProp } from "@editor/node-manager/actions/updateComponentProp";
import { useFileManagerStore } from "@project/file-manager";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseInstanceParams {
  projectId: string;
  fileId: string;
  nodeId: string;
}

interface InstanceData {
  componentFileId: string;
  componentFileName: string;
  props: Record<string, ComponentProp>;
}

export function useInstance({ projectId, fileId, nodeId }: UseInstanceParams) {
  const [updatingProps, setUpdatingProps] = useState<Set<string>>(new Set());
  const [localValues, setLocalValues] = useState<Record<string, string | number | boolean | null>>({});
  const hasLocalValueRef = useRef<Set<string>>(new Set());
  const activeInputRef = useRef<string | null>(null);

  const layerTree = useFileManagerStore((state) => state.files[fileId]?.layerTree?.flat, projectId);

  // Get component file ID from layerTree first
  const componentFileId = useMemo(() => {
    if (!layerTree || !nodeId) return null;
    const nodeInfo = layerTree[nodeId];
    return nodeInfo?.isComponent ? nodeInfo.component?.fileId : null;
  }, [layerTree, nodeId]);

  // Watch component file's properties directly to detect changes
  const componentProperties = useFileManagerStore(
    (state) => (componentFileId ? state.files[componentFileId]?.properties : null),
    projectId
  );
  const componentParams = useFileManagerStore(
    (state) => (componentFileId ? state.files[componentFileId]?.params : null),
    projectId
  );

  const nodeData = useMemo<InstanceData | null>(() => {
    if (!layerTree || !nodeId) return null;

    const nodeInfo = layerTree[nodeId];
    if (!nodeInfo?.isComponent || !nodeInfo.component) return null;

    const { fileId: compFileId, fileName: componentFileName } = nodeInfo.component;

    // Rebuild props from current properties and params, merging with current instance values
    const currentProps = nodeInfo.component.props || {};
    const props: Record<string, ComponentProp> = {};

    // Use component file's current properties (which may have been updated)
    if (componentProperties) {
      for (const [propName, property] of Object.entries(componentProperties)) {
        const param = componentParams?.[propName];
        props[propName] = {
          type: property.type,
          optional: property.optional ?? false,
          defaultValue: param?.defaultValue ?? null,
          currentValue: currentProps[propName]?.currentValue ?? null,
        };
      }
    } else {
      // Fallback to props from layerTree if properties not available
      Object.assign(props, currentProps);
    }

    return {
      componentFileId: compFileId,
      componentFileName,
      props,
    };
  }, [layerTree, nodeId, componentProperties, componentParams]);

  // Reset state when nodeId changes
  useEffect(() => {
    setLocalValues({});
    hasLocalValueRef.current.clear();
    activeInputRef.current = null;
  }, [nodeId]);

  // Sync local values with props, preserving user input during typing
  useEffect(() => {
    if (!nodeData?.props) return;

    setLocalValues((prevLocalValues) => {
      return Object.entries(nodeData.props).reduce(
        (acc, [propName, prop]) => {
          const propValue = prop.currentValue ?? prop.defaultValue ?? null;
          const hasLocalValue = hasLocalValueRef.current.has(propName);

          acc[propName] = hasLocalValue ? (prevLocalValues[propName] ?? propValue) : propValue;
          return acc;
        },
        {} as Record<string, string | number | boolean | null>
      );
    });

    // Restore focus to active input after update
    if (activeInputRef.current) {
      const inputId = activeInputRef.current;
      setTimeout(() => {
        const input = document.getElementById(inputId);
        if (input) {
          input.focus();
          if (input instanceof HTMLInputElement) {
            input.setSelectionRange(input.value.length, input.value.length);
          }
        }
      }, 0);
    }
  }, [nodeData?.props]);

  const handlePropChange = useCallback(
    async (propName: string, value: string | number | boolean) => {
      // Mark prop as having local value and track for focus restoration
      hasLocalValueRef.current.add(propName);
      activeInputRef.current = propName;

      // Update local value immediately to maintain focus
      setLocalValues((prev) => ({ ...prev, [propName]: value }));
      setUpdatingProps((prev) => new Set(prev).add(propName));

      try {
        await updateComponentProp({
          projectId,
          fileId,
          nodeId,
          propName,
          propValue: value,
        });
      } catch (error) {
        console.error("Failed to update prop:", error);
      } finally {
        setUpdatingProps((prev) => {
          const next = new Set(prev);
          next.delete(propName);
          return next;
        });

        // Clear local value flag after a short delay to allow sync
        setTimeout(() => {
          hasLocalValueRef.current.delete(propName);
          if (activeInputRef.current === propName) {
            activeInputRef.current = null;
          }
        }, 100);
      }
    },
    [projectId, fileId, nodeId]
  );

  const getPropValue = useCallback(
    (propName: string): string | number | boolean | null => {
      if (!nodeData?.props[propName]) return null;
      const prop = nodeData.props[propName];
      return localValues[propName] ?? prop.currentValue ?? prop.defaultValue ?? null;
    },
    [nodeData?.props, localValues]
  );

  const isPropUpdating = useCallback(
    (propName: string): boolean => {
      return updatingProps.has(propName);
    },
    [updatingProps]
  );

  return {
    nodeData,
    getPropValue,
    isPropUpdating,
    handlePropChange,
  };
}
