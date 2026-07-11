export type PinnedEntityType = "project" | "file" | "workspace" | "team";

export interface PinnedItem {
  id: string;
  user_id: string;
  entity_type: PinnedEntityType;
  entity_id: string;
  created_at: string;
  updated_at: string;
}

export interface PinnedItemWithEntity extends PinnedItem {
  entity?: {
    id: string;
    name: string;
    // Additional fields based on entity_type
    description?: string;
    owner_id?: string;
    avatar_url?: string;
    repository_path?: string;
    type?: string;
    draft?: boolean;
  };
}

export interface CreatePinnedItemParams {
  entity_type: PinnedEntityType;
  entity_id: string;
  entity?: {
    name: string;
    description?: string;
    owner_id?: string;
    avatar_url?: string;
    repository_path?: string;
    type?: string;
    draft?: boolean;
  };
}
