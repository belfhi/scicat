import { browser, by, element } from "protractor";

import { DashboardPage } from "../dashboard/dashboard.po";
import { LoginPage } from "../login/login.po";

describe("catanie Dataset Filters", function() {
  let lp: LoginPage;
  let page: DashboardPage;
  const urlParams =
    "/datasets?args=(creationLocation:!(),creationTime:(end:!n,start:!n),keywords:!(),limit:30,mode:view,ownerGroup:!(p11114),skip:0,sortField:!n,text:house,type:!())";

  beforeAll(() => {
    lp = new LoginPage();
    lp.navigateTo().then(() => {
      lp.enterDetails(browser.params.login.user, browser.params.login.pwd);
      lp.login();
    });
  });

  it("should contain correct url", () => {
    page = new DashboardPage();
    page.navigateTo(urlParams).then(() => {
      expect(browser.getCurrentUrl()).toContain(urlParams);
    });
  });

  it("should have a prefilled search box", () => {
    page.navigateTo(urlParams).then(() => {
      browser.sleep(1000);
      expect(element(by.name("search")).getAttribute("value")).toContain(
        "house"
      );
    });
  });

  it("should have a prefilled groups input", () => {
    page.navigateTo(urlParams).then(() => {
      browser.sleep(1000);
      expect(
        element(by.cssContainingText(".mat-chip", "p11114")).isPresent()
      ).toBeTruthy();
    });
  });
});
