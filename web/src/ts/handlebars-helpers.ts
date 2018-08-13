import * as Handlebars from "handlebars";

Handlebars.registerHelper("echo", function (cond: string, val: any) {
	return (cond) ? val : "";
});

Handlebars.registerHelper("ico", function (name: string, options: any) {
	let html = '<i>';
	html += iconSymbol(name);
	html += '</i>';
	return html;
});

Handlebars.registerHelper("symbol", function (name: string, options: any) {
	return iconSymbol(name);
});

// we can use like this {{{incl "tmpl-test" data ...}}}
Handlebars.registerHelper("incl", function (templateName: string, data: any, options: any) {
	var params = Array.prototype.slice.call(arguments, 1, arguments.length - 1);
	if (params.length == 1) {
		params = params[0];
	}

	var tmpl = Handlebars.templates[templateName];
	var html = tmpl(params);
	return html;
});


//#region    Utils
function iconSymbol(name: string) {
	var html = ['<svg class="symbol ' + name + '">'];
	html.push('<use xlink:href="#' + name + '"></use>');
	html.push('</svg>');
	return html.join('\n');
}
//#endregion Utils