import { test } from 'playwright/test';
import { DynamicIdPage } from '../../pages/uiTestingPlayground/DynamicIdPage';
import { ClassAttributePage } from '../../pages/uiTestingPlayground/ClassAttributePage';
import { HiddenLayersPage } from '../../pages/uiTestingPlayground/HiddenLayersPage';
import { LoadDelayPage } from '../../pages/uiTestingPlayground/LoadDelayPage';
import { AjaxDataPage } from '../../pages/uiTestingPlayground/AjaxDataPage';
import { ClientSideDelayPage } from '../../pages/uiTestingPlayground/ClientSideDelayPage';
import { ClickEventPage } from '../../pages/uiTestingPlayground/ClickEventPage';
import { TextInputPage } from '../../pages/uiTestingPlayground/TextInputPage';
import { ScrollBarPage } from '../../pages/uiTestingPlayground/ScrollBarPage';
import { DynamicTablePage } from '../../pages/uiTestingPlayground/DynamicTablePage';
import { VerifyTextPage } from '../../pages/uiTestingPlayground/VerifyTextPage';
import { ProgressBarPage } from '../../pages/uiTestingPlayground/ProgressBarPage';
import { VisibilityPage } from '../../pages/uiTestingPlayground/VisibilityPage';
import { SampleAppPage } from '../../pages/uiTestingPlayground/SampleAppPage';
import { MouseOverPage } from '../../pages/uiTestingPlayground/MouseOverPage';
import { NonBreakingSpacePage } from '../../pages/uiTestingPlayground/NonBreakingSpacePage';
import { OverlappedElementPage } from '../../pages/uiTestingPlayground/OverlappedElementPage';
import { ShadowDomPage } from '../../pages/uiTestingPlayground/ShadowDomPage';

test.describe('UITesting Playground - Page Object Model', () => {

    test('Dynamic ID: Click button with dynamic ID', async ({ page }) => {
        const dynamicIdPage = new DynamicIdPage(page);

        await dynamicIdPage.goto();
        await dynamicIdPage.navigateToDynamicId();
        await dynamicIdPage.clickDynamicButton();
        await dynamicIdPage.verifyDynamicButtonVisible();
    });

    test('Text Input: Enter text and verify button label changes', async ({ page }) => {
        const textInputPage = new TextInputPage(page);
        const testText = 'Test Button Name';

        await textInputPage.goto();
        await textInputPage.navigateToTextInput();
        await textInputPage.enterText(testText);
        await textInputPage.clickButton();
        await textInputPage.verifyButtonText(testText);
    });

    test('Progress Bar: Start progress bar and wait for 75%', async ({ page }) => {
        const progressBarPage = new ProgressBarPage(page);

        await progressBarPage.goto();
        await progressBarPage.navigateToProgressBar();
        await progressBarPage.clickStart();
        await progressBarPage.waitForProgressValue(75);

        const value = await progressBarPage.getProgressValue();
        console.log(`Progress reached: ${value}%`);
    });

    test('Progress Bar: Stop at 75% and verify final value', async ({ page }) => {
        const progressBarPage = new ProgressBarPage(page);

        await progressBarPage.goto();
        await progressBarPage.navigateToProgressBar();
        await progressBarPage.clickStart();
        await progressBarPage.waitForProgressValue(75);
        await progressBarPage.clickStop();

        const finalValue = await progressBarPage.getProgressValue();
        console.log(`Stopped at: ${finalValue}%`);
    });

    test('Dynamic Table: Compare CPU values', async ({ page }) => {
        const dynamicTablePage = new DynamicTablePage(page);

        await dynamicTablePage.goto();
        await dynamicTablePage.navigateToDynamicTable();
        await dynamicTablePage.verifyTableCpuMatchesLabel();
    });

    test('Class Attribute: Record primary (blue) button click and press ok in alert popup', async ({ page }) => {
        const classAttributePage = new ClassAttributePage(page);

        await classAttributePage.goto();
        await classAttributePage.navigateToClassAttribute();
        await classAttributePage.setupDialogHandler();
        await classAttributePage.clickPrimaryButton();
    });

    test('Hidden Layers: Click green button and verify enabled', async ({ page }) => {
        const hiddenLayersPage = new HiddenLayersPage(page);

        await hiddenLayersPage.goto();
        await hiddenLayersPage.navigateToHiddenLayers();
        await hiddenLayersPage.clickGreenButton();
        await hiddenLayersPage.verifyButtonEnabled();
    });

    test('Hidden Layers: Verify green button cannot be clicked twice', async ({ page }) => {
        const hiddenLayersPage = new HiddenLayersPage(page);

        await hiddenLayersPage.goto();
        await hiddenLayersPage.navigateToHiddenLayers();
        await hiddenLayersPage.clickGreenButton();
        await hiddenLayersPage.verifyButtonNotClickable();
    });

    test('Load Delay: Test for page loading and element visibility', async ({ page }) => {
        const loadDelayPage = new LoadDelayPage(page);

        await loadDelayPage.goto();
        await loadDelayPage.navigateToLoadDelay();
        await loadDelayPage.verifyButtonVisible();
    });

    test('AJAX Data: Test for text visibility after clicking a button', async ({ page }) => {
        const ajaxDataPage = new AjaxDataPage(page);

        await ajaxDataPage.goto();
        await ajaxDataPage.navigateToAjaxData();
        await ajaxDataPage.clickAjaxButton();
        await ajaxDataPage.verifyResponseVisible();
    });

    test('Client Side Delay: Test for text visibility after clicking a button', async ({ page }) => {
        const clientSideDelayPage = new ClientSideDelayPage(page);

        await clientSideDelayPage.goto();
        await clientSideDelayPage.navigateToClientSideDelay();
        await clientSideDelayPage.clickClientButton();
        await clientSideDelayPage.verifyResultVisible();
    });

    test('Click: Event based click on DOM Event', async ({ page }) => {
        const clickEventPage = new ClickEventPage(page);

        await clickEventPage.goto();
        await clickEventPage.navigateToClickEvent();
        await clickEventPage.clickIgnoreButton();
        await clickEventPage.verifySuccessButtonEnabled();
    });

    test('ScrollBar: Test for scrolling to an element and clicking it', async ({ page }) => {
        const scrollBarPage = new ScrollBarPage(page);

        await scrollBarPage.goto();
        await scrollBarPage.navigateToScrollBar();
        await scrollBarPage.clickHidingButton();
        await scrollBarPage.verifyButtonVisible();
    });

    test('Verify Text: Finding an element by displayed text has nuances', async ({ page }) => {
        const verifyTextPage = new VerifyTextPage(page);

        await verifyTextPage.goto();
        await verifyTextPage.navigateToVerifyText();
        await verifyTextPage.verifyButtonVisible();
    });

    test('Visibility: Verify removed button is not visible after hide', async ({ page }) => {
        const visibilityPage = new VisibilityPage(page);

        await visibilityPage.goto();
        await visibilityPage.navigateToVisibility();
        await visibilityPage.clickHideButton();
        await visibilityPage.verifyRemovedButtonNotVisible();
    });

    test('Visibility: Verify zero width button is not visible after hide', async ({ page }) => {
        const visibilityPage = new VisibilityPage(page);

        await visibilityPage.goto();
        await visibilityPage.navigateToVisibility();
        await visibilityPage.clickHideButton();
        await visibilityPage.verifyZeroWidthButtonNotVisible();
    });

    test('Visibility: Verify overlapped button remains visible after hide', async ({ page }) => {
        const visibilityPage = new VisibilityPage(page);

        await visibilityPage.goto();
        await visibilityPage.navigateToVisibility();
        await visibilityPage.clickHideButton();
        await visibilityPage.verifyOverlappedButtonVisible();
    });

    test('Sample App: Enter username and password', async ({ page }) => {
        const sampleAppPage = new SampleAppPage(page);

        await sampleAppPage.goto();
        await sampleAppPage.navigateToSampleApp();
        await sampleAppPage.enterUsername('testuser');
        await sampleAppPage.enterPassword('pwd');
    });

    test('Sample App: Login and verify success message', async ({ page }) => {
        const sampleAppPage = new SampleAppPage(page);

        await sampleAppPage.goto();
        await sampleAppPage.navigateToSampleApp();
        await sampleAppPage.login('testuser', 'pwd');
        await sampleAppPage.verifyLoginStatus('Welcome, testuser!');
    });

    test('Mouse Over: Hover and click active link twice', async ({ page }) => {
        const mouseOverPage = new MouseOverPage(page);

        await mouseOverPage.goto();
        await mouseOverPage.navigateToMouseOver();
        await mouseOverPage.hoverAndClickLink(2);
        await mouseOverPage.verifyClickCount('2');
    });

    test('Mouse Over: Hover and click button twice', async ({ page }) => {
        const mouseOverPage = new MouseOverPage(page);

        await mouseOverPage.goto();
        await mouseOverPage.navigateToMouseOver();
        await mouseOverPage.hoverAndClickButton(2);
        await mouseOverPage.verifyClickButtonCount('2');
    });

    test('Non-Breaking Space: Test for text visibility with non-breaking spaces', async ({ page }) => {
        const nonBreakingSpacePage = new NonBreakingSpacePage(page);

        await nonBreakingSpacePage.goto();
        await nonBreakingSpacePage.navigateToNonBreakingSpace();
        await nonBreakingSpacePage.verifyButtonVisible();
    });

    test('Overlapped Element: Test for clicking an overlapped element', async ({ page }) => {
        const overlappedElementPage = new OverlappedElementPage(page);

        await overlappedElementPage.goto();
        await overlappedElementPage.navigateToOverlappedElement();
        await overlappedElementPage.fillIdField('test input');
        await overlappedElementPage.fillNameField('test name');
    });

    test('Shadow DOM: Test for interacting with elements inside Shadow DOM', async ({ page, context }) => {
        await context.grantPermissions(['clipboard-read', 'clipboard-write']);
        const shadowDomPage = new ShadowDomPage(page);

        await shadowDomPage.goto();
        await shadowDomPage.navigateToShadowDom();
        await shadowDomPage.clickCogIcon();
        await shadowDomPage.copyToClipboard();
        await shadowDomPage.verifyClipboardMatchesEditField();
    });

});