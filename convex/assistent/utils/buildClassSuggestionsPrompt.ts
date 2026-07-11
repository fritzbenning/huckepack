export function buildClassSuggestionsPrompt(componentCode: string, nodeId: string, currentClasses: string): string {
  return `You are a Tailwind CSS expert.

Your task is to suggest 4 classes that would enhance the design and usability of the element, based on its semantic role
and context within the component.

This is the react component:
${componentCode}

You can identify the element with the data-node-id attribute: ${nodeId}

Like you can see in the component code, these classes are currently applied to the element:
current classes: ${currentClasses}

Please follow these steps to resolve the task:

1. Infer the purpose and role of the element:
   - HTML tag and semantics
   - Visible content
   - Position within the layout
   - Relationship to nearby elements
2. Check which classes are currently applied
3. Consider which new classes would improve the element's design and usability.
4. Choose 4 tailwind classes by applying the following rules:

- IMPORTANT:Don't suggest classes that are already applied to the element.
  Example: When current classes already contain "text-base", don't suggest "text-lg".
- Don't suggest classes that have the same purpose like an existing class.
  Example: Don't suggest "text-lg", when "text-base" is already applied.
- Don't suggest classes that wouldn't make sense because other classes are missing.  
  Example: Don't suggest "gap-2", when "flex" is not applied. It's fine to suggest both classes together.
- Always prioritize classes that makes sense related to the existing classes. 
  Example: When "flex" is applied, suggest "gap", "flex-col" or other related classes.
  Example: When "shadow-md" is applied and a background-color is missing, suggest a background-color class.
- Always prioritze classes that have an visual impact on the existing content. 
  Example: When the element contains text directly, suggest text related classes


5. Check again if your suggestions are following the rules. When not, adjust your suggestions.

The output should be a valid JSON with the following structure:

{
  "suggestions": ["class-name", "class-name", "class-name", "class-name"]
}`;
}
