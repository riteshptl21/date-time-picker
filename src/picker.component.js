/**
 * picker.component
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var forms_1 = require("@angular/forms");
var date_fns_1 = require("date-fns");
var numberedFixLen_pipe_1 = require("./numberedFixLen.pipe");
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Time"] = 0] = "Time";
    DialogType[DialogType["Date"] = 1] = "Date";
    DialogType[DialogType["Month"] = 2] = "Month";
    DialogType[DialogType["Year"] = 3] = "Year";
})(DialogType = exports.DialogType || (exports.DialogType = {}));
exports.DATETIMEPICKER_VALUE_ACCESSOR = {
    provide: forms_1.NG_VALUE_ACCESSOR,
    useExisting: core_1.forwardRef(function () { return DateTimePickerComponent; }),
    multi: true
};
var DateTimePickerComponent = (function () {
    function DateTimePickerComponent(renderer, numFixedLenPipe) {
        this.renderer = renderer;
        this.numFixedLenPipe = numFixedLenPipe;
        /**
         * Type of the value to write back to ngModel
         * @default 'date' -- Javascript Date type
         * @type {'string' | 'date'}
         * */
        this.dataType = 'date';
        /**
         * Format of the date
         * @default 'y/MM/dd'
         * @type {String}
         * */
        this.dateFormat = 'YYYY/MM/DD HH:mm';
        /**
         * Array with dates that should be disabled (not selectable)
         * @default null
         * @type {Date[]}
         * */
        this.disabledDates = [];
        /**
         * Picker input placeholder value
         * @default
         * @type {String}
         * */
        this.placeHolder = 'yyyy/mm/dd hh:mm';
        /**
         * Defines the quantity of the selection
         *      'single' -- allow only a date value to be selected
         *      'multiple' -- allow multiple date value to be selected
         *      'range' -- allow to select an range ot date values
         * @default 'single'
         * @type {string}
         * */
        this.selectionMode = 'single';
        /**
         * Set the type of the dateTime picker
         *      'both' -- show both calendar and timer
         *      'calendar' -- show only calendar
         *      'timer' -- show only timer
         * @default 'both'
         * @type {'both' | 'calendar' | 'timer'}
         * */
        this.type = 'both';
        /**
         * Determine the hour format (12 or 24)
         * @default '24'
         * @type {'24'| '12'}
         * */
        this.hourFormat = '24';
        /**
         * When it is set to false, only show current month's days in calendar
         * @default true
         * @type {boolean}
         * */
        this.showOtherMonths = true;
        /**
         * Callback to invoke when dropdown gets focus.
         * */
        this.onFocus = new core_1.EventEmitter();
        /**
         * Callback to invoke when dropdown loses focus.
         * */
        this.onBlur = new core_1.EventEmitter();
        /**
         * Callback to invoke when a invalid date is selected.
         * */
        this.onInvalid = new core_1.EventEmitter();
        this.calendarYears = [];
        this.dialogType = DialogType.Date;
        this.formattedValue = '';
        this.meridianValue = 'AM';
        this._locale = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dateFns: null
        };
        this.valueIndex = 0;
        this.onModelChange = function () {
        };
        this.onModelTouched = function () {
        };
    }
    Object.defineProperty(DateTimePickerComponent.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (val) {
            this._max = this.parseToDate(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTimePickerComponent.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (val) {
            this._min = this.parseToDate(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DateTimePickerComponent.prototype, "locale", {
        /**
         * An object having regional configuration properties for the dateTimePicker
         * */
        get: function () {
            return this._locale;
        },
        set: function (val) {
            this._locale = Object.assign({}, this._locale, val);
        },
        enumerable: true,
        configurable: true
    });
    DateTimePickerComponent.prototype.ngOnInit = function () {
        this.pickerMoment = new Date();
        this.generateWeekDays();
        this.generateMonthList();
        this.updateCalendar(this.value);
        this.updateTimer(this.value);
    };
    DateTimePickerComponent.prototype.ngOnDestroy = function () {
        this.unbindDocumentClickListener();
    };
    DateTimePickerComponent.prototype.writeValue = function (obj) {
        if (obj instanceof Array) {
            this.value = [];
            for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
                var o = obj_1[_i];
                var v = this.parseToDate(o);
                this.value.push(v);
            }
            this.updateCalendar(this.value[0]);
            this.updateTimer(this.value[0]);
        }
        else {
            this.value = this.parseToDate(obj);
            this.updateCalendar(this.value);
            this.updateTimer(this.value);
        }
        this.updateFormattedValue();
    };
    DateTimePickerComponent.prototype.registerOnChange = function (fn) {
        this.onModelChange = fn;
    };
    DateTimePickerComponent.prototype.registerOnTouched = function (fn) {
        this.onModelTouched = fn;
    };
    DateTimePickerComponent.prototype.setDisabledState = function (isDisabled) {
        this.disabled = isDisabled;
    };
    /**
     * Handle click event on the text input
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.onInputClick = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        this.dialogClick = true;
        if (!this.dialogVisible) {
            this.show();
        }
        event.preventDefault();
        return;
    };
    /**
     * Set the element on focus
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.onInputFocus = function (event) {
        this.focus = true;
        this.onFocus.emit(event);
        event.preventDefault();
        return;
    };
    /**
     * Set the element on blur
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.onInputBlur = function (event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
        event.preventDefault();
        return;
    };
    /**
     * Handle click event on the dialog
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.onDialogClick = function (event) {
        this.dialogClick = true;
    };
    /**
     * Go to previous month
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.prevMonth = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        this.pickerMoment = date_fns_1.addMonths(this.pickerMoment, -1);
        this.generateCalendar();
        event.preventDefault();
        return;
    };
    /**
     * Go to next month
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.nextMonth = function (event) {
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        this.pickerMoment = date_fns_1.addMonths(this.pickerMoment, 1);
        this.generateCalendar();
        event.preventDefault();
        return;
    };
    /**
     * Select a date
     * @param {any} event
     * @param {Date} date
     * @return {void}
     * */
    DateTimePickerComponent.prototype.selectDate = function (event, date) {
        if (this.disabled || !date) {
            event.preventDefault();
            return;
        }
        var temp;
        // check if the selected date is valid
        if (this.isValidValue(date)) {
            temp = date;
        }
        else {
            if (date_fns_1.isSameDay(date, this._min)) {
                temp = this._min;
            }
            else if (date_fns_1.isSameDay(date, this._max)) {
                temp = this._max;
            }
            else {
                this.onInvalid.emit({ originalEvent: event, value: date });
                return;
            }
        }
        var selected;
        if (this.isSingleSelection()) {
            if (!date_fns_1.isSameDay(this.value, temp)) {
                selected = temp;
            }
        }
        else if (this.isRangeSelection()) {
            if (this.value && this.value.length) {
                var startDate = this.value[0];
                var endDate = this.value[1];
                if (!endDate && temp.getTime() > startDate.getTime()) {
                    endDate = temp;
                    this.valueIndex = 1;
                }
                else {
                    startDate = temp;
                    endDate = null;
                    this.valueIndex = 0;
                }
                selected = [startDate, endDate];
            }
            else {
                selected = [temp, null];
                this.valueIndex = 0;
            }
        }
        else if (this.isMultiSelection()) {
            // check if it exceeds the maxDateCount limit
            if (this.maxDateCount && this.value &&
                this.value.length && this.value.length >= this.maxDateCount) {
                this.onInvalid.emit({ originalEvent: event, value: 'Exceed max date count.' });
                return;
            }
            if (this.isSelectedDay(temp)) {
                selected = this.value.filter(function (d) {
                    return !date_fns_1.isSameDay(d, temp);
                });
            }
            else {
                selected = this.value ? this.value.concat([temp]) : [temp];
                this.valueIndex = selected.length - 1;
            }
        }
        if (selected) {
            this.updateModel(selected);
            if (this.value instanceof Array) {
                this.updateCalendar(this.value[this.valueIndex]);
                this.updateTimer(this.value[this.valueIndex]);
            }
            else {
                this.updateCalendar(this.value);
                this.updateTimer(this.value);
            }
            this.updateFormattedValue();
        }
    };
    /**
     * Set a pickerMoment's month
     * @param {Number} monthNum
     * @return {void}
     * */
    DateTimePickerComponent.prototype.selectMonth = function (monthNum) {
        this.pickerMoment = date_fns_1.setMonth(this.pickerMoment, monthNum);
        this.generateCalendar();
        this.changeDialogType(DialogType.Month);
    };
    /**
     * Set a pickerMoment's year
     * @param {Number} yearNum
     * @return {void}
     * */
    DateTimePickerComponent.prototype.selectYear = function (yearNum) {
        this.pickerMoment = date_fns_1.setYear(this.pickerMoment, yearNum);
        this.generateCalendar();
        this.changeDialogType(DialogType.Year);
    };
    /**
     * Set the selected moment's meridian
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.toggleMeridian = function (event) {
        var value = this.value ? (this.value.length ? this.value[this.valueIndex] : this.value) : null;
        if (this.disabled) {
            event.preventDefault();
            return;
        }
        if (!value) {
            this.meridianValue = this.meridianValue === 'AM' ? 'PM' : 'AM';
            return;
        }
        var hours = date_fns_1.getHours(value);
        if (this.meridianValue === 'AM') {
            hours += 12;
        }
        else if (this.meridianValue === 'PM') {
            hours -= 12;
        }
        var selectedTime = date_fns_1.setHours(value, hours);
        this.setSelectedTime(selectedTime);
        event.preventDefault();
        return;
    };
    /**
     * Set the selected moment's hour
     * @param {any} event
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setHoursOnKeyBoard = function (event, input) {
        if (event.key === "ArrowUp") {
            return this.setHours(event, 'increase', input);
        }
        else if (event.key === "ArrowDown") {
            return this.setHours(event, 'decrease', input);
        }
    };
    /**
     * Set the selected moment's hour
     * @param {any} event
     * @param {'increase' | 'decrease' | number} val
     *      'increase' -- increase hour value by 1
     *      'decrease' -- decrease hour value by 1
     *      number -- set hour value to val
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setHours = function (event, val, input) {
        var value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            }
            else {
                value = this.value;
            }
        }
        else {
            if (this.type === 'timer') {
                value = new Date();
            }
            else {
                value = null;
            }
        }
        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }
        var hours = date_fns_1.getHours(value);
        if (val === 'increase') {
            hours += 1;
        }
        else if (val === 'decrease') {
            hours -= 1;
        }
        else {
            hours = val;
        }
        if (hours > 23) {
            hours = 0;
        }
        else if (hours < 0) {
            hours = 23;
        }
        var selectedTime = date_fns_1.setHours(value, hours);
        var done = this.setSelectedTime(selectedTime);
        // Focus the input and select its value when model updated
        if (input) {
            setTimeout(function () {
                input.focus();
            }, 0);
        }
        event.preventDefault();
        return done;
    };
    /**
     * Set the selected moment's minute
     * @param {any} event
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setMinutesOnKeyBoard = function (event, input) {
        if (event.key === "ArrowUp") {
            return this.setMinutes(event, 'increase', input);
        }
        else if (event.key === "ArrowDown") {
            return this.setMinutes(event, 'decrease', input);
        }
    };
    /**
     * Set the selected moment's minute
     * @param {any} event
     * @param {'increase' | 'decrease' | number} val
     *      'increase' -- increase minute value by 1
     *      'decrease' -- decrease minute value by 1
     *      number -- set minute value to val
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setMinutes = function (event, val, input) {
        var value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            }
            else {
                value = this.value;
            }
        }
        else {
            if (this.type === 'timer') {
                value = new Date();
            }
            else {
                value = null;
            }
        }
        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }
        var minutes = date_fns_1.getMinutes(value);
        if (val === 'increase') {
            minutes += 1;
        }
        else if (val === 'decrease') {
            minutes -= 1;
        }
        else {
            minutes = val;
        }
        if (minutes > 59) {
            minutes = 0;
        }
        else if (minutes < 0) {
            minutes = 59;
        }
        var selectedTime = date_fns_1.setMinutes(value, minutes);
        var done = this.setSelectedTime(selectedTime);
        // Focus the input and select its value when model updated
        if (input) {
            setTimeout(function () {
                input.focus();
            }, 0);
        }
        event.preventDefault();
        return done;
    };
    /**
     * Set the selected moment's second
     * @param {any} event
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setSecondsOnKeyBoard = function (event, input) {
        if (event.key === "ArrowUp") {
            return this.setSeconds(event, 'increase', input);
        }
        else if (event.key === "ArrowDown") {
            return this.setSeconds(event, 'decrease', input);
        }
    };
    /**
     * Set the selected moment's second
     * @param {any} event
     * @param {'increase' | 'decrease' | number} val
     *      'increase' -- increase second value by 1
     *      'decrease' -- decrease second value by 1
     *      number -- set second value to val
     * @param {HTMLInputElement} input -- optional
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setSeconds = function (event, val, input) {
        var value;
        if (this.value) {
            if (this.value.length) {
                value = this.value[this.valueIndex];
            }
            else {
                value = this.value;
            }
        }
        else {
            if (this.type === 'timer') {
                value = new Date();
            }
            else {
                value = null;
            }
        }
        if (this.disabled || !value) {
            event.preventDefault();
            return false;
        }
        var seconds = date_fns_1.getSeconds(value);
        if (val === 'increase') {
            seconds = this.secValue + 1;
        }
        else if (val === 'decrease') {
            seconds = this.secValue - 1;
        }
        else {
            seconds = val;
        }
        if (seconds > 59) {
            seconds = 0;
        }
        else if (seconds < 0) {
            seconds = 59;
        }
        var selectedTime = date_fns_1.setSeconds(value, seconds);
        var done = this.setSelectedTime(selectedTime);
        // Focus the input and select its value when model updated
        if (input) {
            setTimeout(function () {
                input.focus();
            }, 0);
        }
        event.preventDefault();
        return done;
    };
    /**
     * Check if the date is selected
     * @param {Date} date
     * @return {Boolean}
     * */
    DateTimePickerComponent.prototype.isSelectedDay = function (date) {
        if (this.isSingleSelection()) {
            return this.value && date_fns_1.isSameDay(this.value, date);
        }
        else if (this.isRangeSelection() && this.value && this.value.length) {
            if (this.value[1]) {
                return (date_fns_1.isSameDay(this.value[0], date) || date_fns_1.isSameDay(this.value[1], date) ||
                    this.isDayBetween(this.value[0], this.value[1], date)) && this.isValidDay(date);
            }
            else {
                return date_fns_1.isSameDay(this.value[0], date);
            }
        }
        else if (this.isMultiSelection() && this.value && this.value.length) {
            var selected = void 0;
            for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
                var d = _a[_i];
                selected = date_fns_1.isSameDay(d, date);
                if (selected) {
                    break;
                }
            }
            return selected;
        }
        return false;
    };
    /**
     * Check if a day is between two specific days
     * @param {Date} start
     * @param {Date} end
     * @param {Date} day
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.isDayBetween = function (start, end, day) {
        if (start && end) {
            return date_fns_1.isAfter(day, start) && date_fns_1.isBefore(day, end);
        }
        else {
            return false;
        }
    };
    /**
     * Check if the calendar day is a valid day
     * @param {Date}  date
     * @return {Boolean}
     * */
    DateTimePickerComponent.prototype.isValidDay = function (date) {
        var isValid = true;
        if (this.disabledDates && this.disabledDates.length) {
            for (var _i = 0, _a = this.disabledDates; _i < _a.length; _i++) {
                var disabledDate = _a[_i];
                if (date_fns_1.isSameDay(disabledDate, date)) {
                    return false;
                }
            }
        }
        if (isValid && this.disabledDays && this.disabledDays.length) {
            var weekdayNum = date_fns_1.getDay(date);
            isValid = this.disabledDays.indexOf(weekdayNum) === -1;
        }
        if (isValid && this.min) {
            isValid = isValid && !date_fns_1.isBefore(date, date_fns_1.startOfDay(this.min));
        }
        if (isValid && this.max) {
            isValid = isValid && !date_fns_1.isAfter(date, date_fns_1.startOfDay(this.max));
        }
        return isValid;
    };
    /**
     * Check if the month is current pickerMoment's month
     * @param {Number} monthNum
     * @return {Boolean}
     * */
    DateTimePickerComponent.prototype.isCurrentMonth = function (monthNum) {
        return date_fns_1.getMonth(this.pickerMoment) == monthNum;
    };
    /**
     * Check if the year is current pickerMoment's year
     * @param {Number} yearNum
     * @return {Boolean}
     * */
    DateTimePickerComponent.prototype.isCurrentYear = function (yearNum) {
        return date_fns_1.getYear(this.pickerMoment) == yearNum;
    };
    /**
     * Change the dialog type
     * @param {DialogType} type
     * @return {void}
     * */
    DateTimePickerComponent.prototype.changeDialogType = function (type) {
        if (this.dialogType === type) {
            this.dialogType = DialogType.Date;
            return;
        }
        else {
            this.dialogType = type;
        }
        if (this.dialogType === DialogType.Year) {
            this.generateYearList();
        }
    };
    /**
     * Handle blur event on timer input
     * @param {any} event
     * @param {HTMLInputElement} input
     * @param {string} type
     * @param {number} modelValue
     * @return {void}
     * */
    DateTimePickerComponent.prototype.onTimerInputBlur = function (event, input, type, modelValue) {
        var val = +input.value;
        if (this.disabled || val === modelValue) {
            event.preventDefault();
            return;
        }
        var done;
        if (!isNaN(val)) {
            switch (type) {
                case 'hours':
                    if (this.hourFormat === '24' &&
                        val >= 0 && val <= 23) {
                        done = this.setHours(event, val);
                    }
                    else if (this.hourFormat === '12'
                        && val >= 1 && val <= 12) {
                        if (this.meridianValue === 'AM' && val === 12) {
                            val = 0;
                        }
                        else if (this.meridianValue === 'PM' && val < 12) {
                            val = val + 12;
                        }
                        done = this.setHours(event, val);
                    }
                    break;
                case 'minutes':
                    if (val >= 0 && val <= 59) {
                        done = this.setMinutes(event, val);
                    }
                    break;
                case 'seconds':
                    if (val >= 0 && val <= 59) {
                        done = this.setSeconds(event, val);
                    }
                    break;
            }
        }
        if (!done) {
            input.value = this.numFixedLenPipe.transform(modelValue, 2);
            input.focus();
            return;
        }
        event.preventDefault();
        return;
    };
    /**
     * Set value to null
     * @param {any} event
     * @return {void}
     * */
    DateTimePickerComponent.prototype.clearValue = function (event) {
        this.dialogClick = true;
        this.updateModel(null);
        this.updateTimer(this.value);
        this.updateFormattedValue();
        event.preventDefault();
    };
    /**
     * Show the dialog
     * @return {void}
     * */
    DateTimePickerComponent.prototype.show = function () {
        this.alignDialog();
        this.dialogVisible = true;
        this.dialogType = DialogType.Date;
        this.bindDocumentClickListener();
        return;
    };
    /**
     * Hide the dialog
     * @return {void}
     * */
    DateTimePickerComponent.prototype.hide = function () {
        this.dialogVisible = false;
        this.unbindDocumentClickListener();
        return;
    };
    /**
     * Set the dialog position
     * @return {void}
     * */
    DateTimePickerComponent.prototype.alignDialog = function () {
        var element = this.dialogElm.nativeElement;
        var target = this.containerElm.nativeElement;
        var elementDimensions = element.offsetParent ? {
            width: element.offsetWidth,
            height: element.offsetHeight
        } : this.getHiddenElementDimensions(element);
        var targetHeight = target.offsetHeight;
        var targetWidth = target.offsetWidth;
        var targetOffset = target.getBoundingClientRect();
        var viewport = this.getViewport();
        var top, left;
        if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
            top = -1 * (elementDimensions.height);
            if (targetOffset.top + top < 0) {
                top = 0;
            }
        }
        else {
            top = targetHeight;
        }
        if ((targetOffset.left + elementDimensions.width) > viewport.width)
            left = targetWidth - elementDimensions.width;
        else
            left = 0;
        element.style.top = top + 'px';
        element.style.left = left + 'px';
    };
    /**
     * Bind click event on document
     * @return {void}
     * */
    DateTimePickerComponent.prototype.bindDocumentClickListener = function () {
        var _this = this;
        var firstClick = true;
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen('document', 'click', function () {
                if (!firstClick && !_this.dialogClick) {
                    _this.hide();
                }
                firstClick = false;
                _this.dialogClick = false;
            });
        }
        return;
    };
    /**
     * Unbind click event on document
     * @return {void}
     * */
    DateTimePickerComponent.prototype.unbindDocumentClickListener = function () {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        return;
    };
    /**
     * Parse a object to Date object
     * @param {any} val
     * @return {Date}
     * */
    DateTimePickerComponent.prototype.parseToDate = function (val) {
        if (!val) {
            return;
        }
        var parsedVal;
        if (typeof val === 'string') {
            parsedVal = date_fns_1.parse(val);
        }
        else {
            parsedVal = val;
        }
        return date_fns_1.isValid(parsedVal) ? parsedVal : null;
    };
    /**
     * Generate the calendar days array
     * @return {void}
     * */
    DateTimePickerComponent.prototype.generateCalendar = function () {
        if (!this.pickerMoment) {
            return;
        }
        this.calendarDays = [];
        var startDateOfMonth = date_fns_1.startOfMonth(this.pickerMoment);
        var startWeekdayOfMonth = date_fns_1.getDay(startDateOfMonth);
        var dayDiff = 0 - (startWeekdayOfMonth + (7 - this.locale.firstDayOfWeek)) % 7;
        for (var i = 1; i < 7; i++) {
            var week = [];
            for (var j = 0; j < 7; j++) {
                var date = date_fns_1.addDays(startDateOfMonth, dayDiff);
                var inOtherMonth = !date_fns_1.isSameMonth(date, this.pickerMoment);
                week.push({
                    date: date,
                    num: date_fns_1.getDate(date),
                    today: date_fns_1.isToday(date),
                    otherMonth: inOtherMonth,
                    hide: !this.showOtherMonths && inOtherMonth,
                });
                dayDiff += 1;
            }
            this.calendarDays.push(week);
        }
        this.pickerMonth = this.locale.monthNames[date_fns_1.getMonth(this.pickerMoment)];
        this.pickerYear = date_fns_1.getYear(this.pickerMoment).toString();
    };
    /**
     * Generate the calendar weekdays array
     * */
    DateTimePickerComponent.prototype.generateWeekDays = function () {
        if (this.type === 'timer') {
            return;
        }
        this.calendarWeekdays = [];
        var dayIndex = this.locale.firstDayOfWeek;
        for (var i = 0; i < 7; i++) {
            this.calendarWeekdays.push(this.locale.dayNamesShort[dayIndex]);
            dayIndex = (dayIndex == 6) ? 0 : ++dayIndex;
        }
        return;
    };
    /**
     * Generate the calendar month array
     * @return {void}
     * */
    DateTimePickerComponent.prototype.generateMonthList = function () {
        if (this.type === 'timer') {
            return;
        }
        this.calendarMonths = [];
        var monthIndex = 0;
        for (var i = 0; i < 4; i++) {
            var months = [];
            for (var j = 0; j < 3; j++) {
                months.push(this.locale.monthNamesShort[monthIndex]);
                monthIndex += 1;
            }
            this.calendarMonths.push(months);
        }
        return;
    };
    /**
     * Generate the calendar year array
     * @return {void}
     * */
    DateTimePickerComponent.prototype.generateYearList = function (dir) {
        if (!this.pickerMoment) {
            return;
        }
        var start;
        if (dir === 'prev') {
            start = +this.calendarYears[0][0] - 12;
        }
        else if (dir === 'next') {
            start = +this.calendarYears[3][2] + 1;
        }
        else {
            start = date_fns_1.getYear(date_fns_1.addYears(this.pickerMoment, -4));
        }
        for (var i = 0; i < 4; i++) {
            var years = [];
            for (var j = 0; j < 3; j++) {
                var year = (start + i * 3 + j).toString();
                years.push(year);
            }
            this.calendarYears[i] = years;
        }
        return;
    };
    /**
     * Update the calendar
     * @param {Date} value
     * @return {void}
     * */
    DateTimePickerComponent.prototype.updateCalendar = function (value) {
        // if the dateTime picker is only the timer,
        // no need to update the update Calendar.
        if (this.type === 'timer') {
            return;
        }
        if (value && (!this.calendarDays || !date_fns_1.isSameMonth(value, this.pickerMoment))) {
            this.pickerMoment = date_fns_1.setMonth(this.pickerMoment, date_fns_1.getMonth(value));
            this.pickerMoment = date_fns_1.setYear(this.pickerMoment, date_fns_1.getYear(value));
            this.generateCalendar();
        }
        else if (!value && !this.calendarDays) {
            this.generateCalendar();
        }
        return;
    };
    /**
     * Update the timer
     * @param {Date} value
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.updateTimer = function (value) {
        // if the dateTime picker is only the calendar,
        // no need to update the timer
        if (this.type === 'calendar') {
            return false;
        }
        if (!value) {
            this.hourValue = null;
            this.minValue = null;
            this.secValue = null;
            return true;
        }
        var time = value;
        var hours = date_fns_1.getHours(time);
        if (this.hourFormat === '12') {
            if (hours < 12 && hours > 0) {
                this.hourValue = hours;
                this.meridianValue = 'AM';
            }
            else if (hours > 12) {
                this.hourValue = hours - 12;
                this.meridianValue = 'PM';
            }
            else if (hours === 12) {
                this.hourValue = 12;
                this.meridianValue = 'PM';
            }
            else if (hours === 0) {
                this.hourValue = 12;
                this.meridianValue = 'AM';
            }
        }
        else if (this.hourFormat === '24') {
            this.hourValue = hours;
        }
        this.minValue = date_fns_1.getMinutes(time);
        this.secValue = date_fns_1.getSeconds(time);
        return true;
    };
    /**
     * Update ngModel
     * @param {Date} value
     * @return {Boolean}
     * */
    DateTimePickerComponent.prototype.updateModel = function (value) {
        this.value = value;
        if (this.dataType === 'date') {
            this.onModelChange(this.value);
        }
        else if (this.dataType === 'string') {
            if (this.value && this.value.length) {
                var formatted = [];
                for (var _i = 0, _a = this.value; _i < _a.length; _i++) {
                    var v = _a[_i];
                    if (v) {
                        formatted.push(date_fns_1.format(v, this.dateFormat, { locale: this.locale.dateFns }));
                    }
                    else {
                        formatted.push(null);
                    }
                }
                this.onModelChange(formatted);
            }
            else {
                this.onModelChange(date_fns_1.format(this.value, this.dateFormat, { locale: this.locale.dateFns }));
            }
        }
        return true;
    };
    /**
     * Update variable formattedValue
     * @return {void}
     * */
    DateTimePickerComponent.prototype.updateFormattedValue = function () {
        var formattedValue = '';
        if (this.value) {
            if (this.isSingleSelection()) {
                formattedValue = date_fns_1.format(this.value, this.dateFormat, { locale: this.locale.dateFns });
            }
            else if (this.isRangeSelection()) {
                var startDate = this.value[0];
                var endDate = this.value[1];
                formattedValue = date_fns_1.format(startDate, this.dateFormat, { locale: this.locale.dateFns });
                if (endDate) {
                    formattedValue += ' - ' + date_fns_1.format(endDate, this.dateFormat, { locale: this.locale.dateFns });
                }
                else {
                    formattedValue += ' - ' + this.dateFormat;
                }
            }
            else if (this.isMultiSelection()) {
                for (var i = 0; i < this.value.length; i++) {
                    var dateAsString = date_fns_1.format(this.value[i], this.dateFormat, { locale: this.locale.dateFns });
                    formattedValue += dateAsString;
                    if (i !== (this.value.length - 1)) {
                        formattedValue += ', ';
                    }
                }
            }
        }
        this.formattedValue = formattedValue;
        return;
    };
    /**
     * Set the time
     * @param {Date} val
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.setSelectedTime = function (val) {
        var done;
        if (this.isValidValue(val)) {
            if (this.value instanceof Array) {
                this.value[this.valueIndex] = val;
                done = this.updateModel(this.value);
                done = done && this.updateTimer(this.value[this.valueIndex]);
            }
            else {
                done = this.updateModel(val);
                done = done && this.updateTimer(this.value);
            }
            this.updateFormattedValue();
        }
        else {
            this.onInvalid.emit({ originalEvent: event, value: val });
            done = false;
        }
        return done;
    };
    DateTimePickerComponent.prototype.isValidValue = function (value) {
        var isValid = true;
        if (this.disabledDates && this.disabledDates.length) {
            for (var _i = 0, _a = this.disabledDates; _i < _a.length; _i++) {
                var disabledDate = _a[_i];
                if (date_fns_1.isSameDay(disabledDate, value)) {
                    return false;
                }
            }
        }
        if (isValid && this.disabledDays && this.disabledDays.length) {
            var weekdayNum = date_fns_1.getDay(value);
            isValid = this.disabledDays.indexOf(weekdayNum) === -1;
        }
        if (isValid && this.min) {
            isValid = isValid && !date_fns_1.isBefore(value, this.min);
        }
        if (isValid && this.max) {
            isValid = isValid && !date_fns_1.isAfter(value, this.max);
        }
        return isValid;
    };
    /**
     * Check if the selection mode is 'single'
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.isSingleSelection = function () {
        return this.selectionMode === 'single';
    };
    /**
     * Check if the selection mode is 'range'
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.isRangeSelection = function () {
        return this.selectionMode === 'range';
    };
    /**
     * Check if the selection mode is 'multiple'
     * @return {boolean}
     * */
    DateTimePickerComponent.prototype.isMultiSelection = function () {
        return this.selectionMode === 'multiple';
    };
    DateTimePickerComponent.prototype.getHiddenElementDimensions = function (element) {
        var dimensions = {};
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        dimensions.width = element.offsetWidth;
        dimensions.height = element.offsetHeight;
        element.style.display = 'none';
        element.style.visibility = 'visible';
        return dimensions;
    };
    DateTimePickerComponent.prototype.getViewport = function () {
        var win = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], w = win.innerWidth || e.clientWidth || g.clientWidth, h = win.innerHeight || e.clientHeight || g.clientHeight;
        return { width: w, height: h };
    };
    return DateTimePickerComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "dataType", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "dateFormat", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "disabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DateTimePickerComponent.prototype, "disabledDates", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DateTimePickerComponent.prototype, "disabledDays", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "inline", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "inputId", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DateTimePickerComponent.prototype, "inputStyle", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "inputStyleClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DateTimePickerComponent.prototype, "maxDateCount", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DateTimePickerComponent.prototype, "max", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DateTimePickerComponent.prototype, "min", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "placeHolder", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "required", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "selectionMode", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "showHeader", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "showSecondsTimer", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], DateTimePickerComponent.prototype, "style", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "styleClass", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Number)
], DateTimePickerComponent.prototype, "tabIndex", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "type", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], DateTimePickerComponent.prototype, "locale", null);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], DateTimePickerComponent.prototype, "hourFormat", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], DateTimePickerComponent.prototype, "showOtherMonths", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DateTimePickerComponent.prototype, "onFocus", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DateTimePickerComponent.prototype, "onBlur", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DateTimePickerComponent.prototype, "onInvalid", void 0);
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", core_1.ElementRef)
], DateTimePickerComponent.prototype, "containerElm", void 0);
__decorate([
    core_1.ViewChild('textInput'),
    __metadata("design:type", core_1.ElementRef)
], DateTimePickerComponent.prototype, "textInputElm", void 0);
__decorate([
    core_1.ViewChild('dialog'),
    __metadata("design:type", core_1.ElementRef)
], DateTimePickerComponent.prototype, "dialogElm", void 0);
DateTimePickerComponent = __decorate([
    core_1.Component({
        selector: 'owl-date-time',
        templateUrl: './picker.component.html',
        styleUrls: ['./picker.component.scss'],
        providers: [numberedFixLen_pipe_1.NumberFixedLenPipe, exports.DATETIMEPICKER_VALUE_ACCESSOR],
        animations: [
            animations_1.trigger('fadeInOut', [
                animations_1.state('hidden', animations_1.style({
                    opacity: 0,
                    display: 'none'
                })),
                animations_1.state('visible', animations_1.style({
                    opacity: 1,
                    display: 'block'
                })),
                animations_1.transition('visible => hidden', animations_1.animate('200ms ease-in')),
                animations_1.transition('hidden => visible', animations_1.animate('400ms ease-out'))
            ])
        ],
    }),
    __metadata("design:paramtypes", [core_1.Renderer2,
        numberedFixLen_pipe_1.NumberFixedLenPipe])
], DateTimePickerComponent);
exports.DateTimePickerComponent = DateTimePickerComponent;
//# sourceMappingURL=picker.component.js.map