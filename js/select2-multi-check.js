(function($) {
  $(document).ready(function() {
    $('[data-multi-select2-init]').each(function(){
      if($(this).attr('multiple') === 'multiple') {
        // init select2 multi select and set additional options
        new initS2MultiSelect({
          fieldName: $(this).attr('data-field-name') || $(this).attr('name'),
          forceShowCounter: $(this).attr('data-show-counter-always') !== undefined
        }, $(this));
      }else{
        // init select2 single select
        $(this).select2();
      }
    });
  });

  function initS2MultiSelect(options, $element) {
    options.forceShowCounter = options.forceShowCounter || false;

    // get the value of the select element
    var selectionValues = $element.val();

    // remove attribute multiple
    $element.removeAttr('multiple');

    // if there are less than 2 optgroup it makes no sense to show a togglable element
    if($element.find('optgroup').length < 2) {
      var optGroupElement = $element.find('optgroup');
      var innerHtml = optGroupElement.html();
      $element.append(innerHtml);
      optGroupElement.remove();
    }

    // init select2 => make sure that this plugin does not include the select2 library, so you have to implement the library before implementing this code extension
    // allowClear is set true, so there will be a button to clear all the selected elements at once
    // placeholder attribute is set otherwise we will get an error in the select2 script
    // the minimumResultForSearch is set to a negative value suppress the search field
    // closeOnSelect is set to false, otherwise the select field would close automatically after a user selected one single attribute
    select2 = $element.select2({
      allowClear: true,
      placeholder: '',
      minimumResultsForSearch: -1,
      closeOnSelect: false,
      templateSelection: function() {
        // not we set up the selection template
        var count = '',
            className = 'full-width',
            selected = $element.val() || [];

        // we don't want to show the counter of the selected attributes if it is zero or forceShowCounter is not set to true
        if(options.forceShowCounter === true || selected.length > 0) {
          count = '<span class="select-field-selected-count">' + selected.length + '</span>';
          className = '';
        }

        // manipulate the DOM and set the select field name and the counter
        return jQuery('<span class="select-field-title ' + className + '">' + options.fieldName + '</span>' + count);
      },
      templateResult: function(result) {
        // check if the option is already loaded
        if (result.loading !== undefined){
          return result.text;
        }

        // set the option text
        var element = $('<div>').text(result.text);

        // set accordion arrows if the element is a optgroup-tag
        if($(result.element).is('optgroup') === true){
          element.closest('[role="group"]').attr('data-open', false);
            element.append('<span class="angle">');
        }

        // set the check marks in the DOM if the element is a option-tag
        if($(result.element).is('option') === true){
          element.addClass('check');
        }

        return element;
      }
    }).data('select2');

    // set data element to initially hide options if they are grouped
    if($element.find('optgroup').length > 1) {
      select2.$dropdown.attr('data-open', false);
    }

    // init event to toggle the groups
    select2.$results.off('mouseup').on('mouseup', '.select2-results__group', function(optionSelect) {
      return function(event) {
      var self = $(this);
        optionSelect.$results.find('[role="group"]').attr('data-open', false);
        if(self.parent('[role="group"]').attr('data-open') !== true) {
          self.parent('[role="group"]').attr('data-open', true);
        }
      }
    }(select2));

    // init events on the selectable elements in the select2 container
    select2.$results.off('click').on('click', '[aria-selected]', function(optionSelect) {
      return function(event) {
        var self = $(this);
        // if the option element already is selected mark it as unselected, otherwise mark it as selected
        optionSelect.trigger((self.attr('aria-selected') === 'true')?'unselect':'select', {
          originalEvent: event,
          data: self.data('data')
        });
      };
    }(select2));

    // set the multiple attribute with the selected value
    $element.attr('multiple', '').val(selectionValues).trigger('change.select2');
  }
})(jQuery);
