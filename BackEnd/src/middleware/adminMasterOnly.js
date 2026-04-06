/**
 * adminMasterOnly.js
 *
 * Secondary gate middleware — chained AFTER adminJwtAuth.
 * Restricts actions to isMasterAdmin === true only.
 *
 * Usage:
 *   router.patch("/applicants/:id/approve", adminJwtAuth, adminMasterOnly, approveApplicant);
 */
export const adminMasterOnly = (req, res, next) => {
  if (!req.admin || !req.admin.isMasterAdmin) {
    return res.status(403).json({
      message: "This action requires master admin privileges.",
    });
  }
  next();
};
