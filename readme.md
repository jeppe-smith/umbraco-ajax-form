# Umbraco AJAX Form

**Submit Umbraco Forms using AJAX**

`new UmbracoAjaxForm(formGuid [, options])`

## Installation

`$ npm i umbraco-ajax-form`

## How to use

[Make sure you prepare your frontend correctly](https://our.umbraco.org/documentation/Add-ons/umbracoforms/developer/Prepping-Frontend/)

Import the module
```
import UmbracoAjaxForm from 'umbraco-ajax-form'
```

Create a new instance of UmbracoAjaxForm and provide it with the guid of the form you wish to submit via AJAX.
```
const formGuid = '6bec4211-0fc0-4539-ab77-6de5d55c4e26'
const form = new UmbracoAjaxForm(formGuid)

form.onsuccess = () => alert('Form submitted successfully')
form.onerror = () => alert('Form not submitted')
```

Add the form to your template.

```
@Umbraco.RenderMacro("FormsRenderForm", new { FormGuid = "6bec4211-0fc0-4539-ab77-6de5d55c4e26", mode = "form" })
```

And that's it, your form is now being submitted via AJAX instead of postback.

## Options

Options is an object and can be parsed as the second argument when creating a new instance of UmbracoAjaxForm

**Note** the value of `this` in all option methods is the current form/step on the page

* **onsuccess(message)** is called when the form is submitted succesfully. `message` is the "Message on submit" as set in the workflow
* **onerror(error)** is called when the form fails to submit.
