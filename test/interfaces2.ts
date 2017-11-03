export interface SearchAttributes {
  id: string;
  category: string;
  content: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  organizationId?: string;
  workspaceId?: string;
  referenceId?: string;
  referenceType?: string;
  ext?: any;
}

export interface Location {
  /**
   * Country
   */
  country: string;
  city: string;
  region: {
    a: string;
    /**
     * b prop
     */
    b: string;
  };
}
