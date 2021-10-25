// for access control
const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("user")
 .readOwn("profile")
 .updateOwn("profile")

ac.grant("manager")
 .extend("user")
 .readAny("profile")

ac.grant("admin")
 .extend("user")
 .extend("manager")
 .updateAny("profile")
 .deleteAny("profile")

return ac;
})();