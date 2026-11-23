export type OrganizationParent = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationUserParent = {
  organizationId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};
