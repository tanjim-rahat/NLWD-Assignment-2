export const isValidRole = (role: string): boolean => {
  const validRoles = ["maintainer", "contributor"];
  return validRoles.includes(role);
};

export const isValidType = (type: string): boolean => {
  const validTypes = ["bug", "feature_request"];
  return validTypes.includes(type);
};

export const isValidStatus = (status: string): boolean => {
  const validStatuses = ["open", "in_progress", "resolved"];
  return validStatuses.includes(status);
};
