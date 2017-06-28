# Umbraco AJAX Form

**Submit Umbraco Forms using AJAX**

`new UmbracoAjaxForm(formGuid [, options])`

## How to use

[Make sure you prepare your frontend correctly](https://our.umbraco.org/documentation/Add-ons/umbracoforms/developer/Prepping-Frontend/)

Create a new instance of UmbracoAjaxForm and provide it with the guid of the form you wish to submit via AJAX.

ContactPage.cshtml
```
@Umbraco.RenderMacro("FormsRenderForm", new { FormGuid = "6bec4211-0fc0-4539-ab77-6de5d55c4e26", mode = "form" })
```

ajax-form.js
```
import UmbracoAjaxForm from 'umbraco-ajax-form'

const formGuid = '6bec4211-0fc0-4539-ab77-6de5d55c4e26'
const umbracoAjaxForm = new UmbracoAjaxForm(formGuid)
```

And that's it, your form is now being submitted via AJAX instead of postback.

## Options

Options is an object and can be parsed as the second argument when creating a new instance of UmbracoAjaxForm

**Note** the value of `this` in all option methods is the current form/step on the page

* **onsuccess(message)** is called when the form is submitted succesfully. `message` is the "Message on submit" as set in the workflow
* **onerror(error)** is called when the form fails to submit.