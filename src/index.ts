import {Plugin, showMessage, confirm, Dialog, Menu, isMobile, openTab} from "siyuan";
import "./index.scss";


// 如果要使用 Options API，请设置为 true；如果要使用 Composition API，请设置为 false
window.__VUE_OPTIONS_API__ = true;
// 启用或禁用 Vue 3 开发工具扩展（仅在开发模式下使用）
window.__VUE_PROD_DEVTOOLS__ = false;
import { createApp } from "vue";
import App from "./App.vue";

const STORAGE_NAME = "menu-config";
const TAB_TYPE = "custom_tab";

export default class PluginSample extends Plugin {

    private customTab: () => any;

    onload() {
        console.log(this.i18n.helloPlugin);

        const topBarElement = this.addTopBar({
            icon: "iconList",
            title: this.i18n.addTopBarIcon,
            position: "right",
            callback: () => {
                this.addMenu(topBarElement.getBoundingClientRect());
            }
        });

        this.customTab = this.addTab({
            type: TAB_TYPE,
            init() {
                this.element.innerHTML = "<div id='View-custom-tab'></div>";
                createApp(App).mount("#View-custom-tab");
            }
        });
    }

    onunload() {
        console.log(this.i18n.byePlugin);
    }

    openSetting() {
        const dialog = new Dialog({
            title: this.name,
            content: `<div class="b3-dialog__content"><textarea class="b3-text-field fn__block" placeholder="readonly text in the menu"></textarea></div>
<div class="b3-dialog__action">
    <button class="b3-button b3-button--cancel">${this.i18n.cancel}</button><div class="fn__space"></div>
    <button class="b3-button b3-button--text">${this.i18n.save}</button>
</div>`,
            width: isMobile() ? "92vw" : "520px",
        });
        const inputElement = dialog.element.querySelector("textarea");
        const btnsElement = dialog.element.querySelectorAll(".b3-button");
        dialog.bindInput(inputElement, () => {
            (btnsElement[1] as HTMLButtonElement).click();
        });
        inputElement.focus();
        btnsElement[0].addEventListener("click", () => {
            dialog.destroy();
        });
        btnsElement[1].addEventListener("click", () => {
            this.saveData(STORAGE_NAME, inputElement.value);
            dialog.destroy();
        });
    }

    private wsEvent({detail}: any) {
        console.log(detail);
    }

    private async addMenu(rect: DOMRect) {
        if (!this.data) {
            await this.loadData(STORAGE_NAME);
        }

        const menu = new Menu("topBarSample", () => {
            console.log(this.i18n.byeMenu);
        });
        menu.addItem({
            icon: "iconHelp",
            label: "confirm",
            click() {
                confirm("Confirm", "Is this a confirm?", () => {
                    showMessage("confirm");
                }, () => {
                    showMessage("cancel");
                });
            }
        });
        menu.addItem({
            icon: "iconFeedback",
            label: "showMessage",
            click: () => {
                showMessage(this.i18n.helloPlugin);
            }
        });
        menu.addItem({
            icon: "iconInfo",
            label: "Dialog",
            click: () => {
                new Dialog({
                    title: "Info",
                    content: '<div class="b3-dialog__content">This is a dialog</div>',
                    width: isMobile() ? "92vw" : "520px",
                });
            }
        });
        menu.addItem({
            icon: "iconLayoutBottom",
            label: "open Tab",
            click: () => {
                openTab({
                    custom: {
                        icon: "iconEmoji",
                        title: "Custom Tab",
                        data: {
                            text: "This is my custom tab",
                        },
                        fn: this.customTab
                    },
                });
            }
        });
        menu.addItem({
            icon: "iconSelect",
            label: "on ws-main",
            click: () => {
                this.eventBus.on("ws-main", this.wsEvent);
            }
        });
        menu.addItem({
            icon: "iconClose",
            label: "off ws-main",
            click: () => {
                this.eventBus.off("ws-main", this.wsEvent);
            }
        });
        menu.addSeparator();
        menu.addItem({
            icon: "iconSparkles",
            label: this.data[STORAGE_NAME] || "readonly",
            type: "readonly",
        });
        if (isMobile()) {
            menu.fullscreen();
        } else {
            menu.open({
                x: rect.right,
                y: rect.bottom,
                isLeft: true,
            });
        }
    }
}