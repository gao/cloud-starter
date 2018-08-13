import fs = require('fs-extra-plus');
import path = require('path');
import { Errors } from "../errors"

// declare  error object
export declare interface ErrorRef {
	todoMessage: string,
	code: string,
	errorMessage: string | Error,
	logError: Function,
	toString: Function
}

// build an error object to show error
export async function buildError(serviceName: string, errorCode: string | Error): Promise<ErrorRef> {
	const errors: any = Errors;
	let code: string = "";
	// get error code for input error
	if (typeof errorCode != "string") {
		const errorObj = <any>errorCode;
		if (errorObj.code) {
			code = errorObj.code;
		} else {
			code = errorObj.message;
		}
	} else {
		code = errorCode;
	}
	const todoMessage = errors[serviceName][code];

	// return the errorRef object
	return {
		todoMessage: todoMessage,
		code: code,
		errorMessage: errorCode,
		logError: function () {
			console.log(this.toString());
		},
		toString: function () {
			let str = `ERROR - ${serviceName}.todo, because:\n${this.code.toString()}`;
			if (todoMessage) {
				str += `\nTODO: ${this.todoMessage}`;
			}
			return str;
		}
	}
}
