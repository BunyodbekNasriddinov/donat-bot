import adminModule from "./admin.module";
import helpModule from "./help.module";
import referralModule from "./referral.module";
import startModule from "./start.module";
import subscriptionModule from "./subscription.module";

class InitModule {
  initModules() {
    const allModules = [
      startModule,
      helpModule,
      adminModule,
      referralModule,
      subscriptionModule,
    ];
    allModules.forEach((module) => module.init());
  }
}

export default new InitModule();
