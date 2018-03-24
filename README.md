This is a simple code extension for select2. The goal of this extension was to show checkboxes in the select2 dropdown, hide the generated tags when a selection is done by a user and show the total count of selected items after the select field title instead.

To use the code, you have to give your html code a structure like the one in the demo. The data-multi-select2-init attribute is required and is needed to initialize the extension. The data-field-name attribute is an optional attribute to define the name of the select field. If there is no data-field-name attribute defined, the name attribute of the select field will be taken instead. The data-show-counter-always attribute is another optional attribute to define, if the total count of selected items is shown all the time or just if there is at least one item selected.

You can also se the demo.html.
