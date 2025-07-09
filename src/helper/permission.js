export const hasPermission = (permission) => {
  const storedPermissions = JSON.parse(localStorage.getItem("permissions"));
  const isSuperUser = JSON.parse(localStorage.getItem("is_superuser"));
  
  return (
    isSuperUser === true ||
    (Array.isArray(storedPermissions) && storedPermissions.includes(permission))
  );
};
