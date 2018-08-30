/**
 * picker.module
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var picker_component_1 = require("./picker.component");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var numberedFixLen_pipe_1 = require("./numberedFixLen.pipe");
var DateTimePickerModule = (function () {
    function DateTimePickerModule() {
    }
    return DateTimePickerModule;
}());
DateTimePickerModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, forms_1.FormsModule],
        exports: [picker_component_1.DateTimePickerComponent],
        declarations: [picker_component_1.DateTimePickerComponent, numberedFixLen_pipe_1.NumberFixedLenPipe],
        providers: [],
    })
], DateTimePickerModule);
exports.DateTimePickerModule = DateTimePickerModule;
//# sourceMappingURL=picker.module.js.map