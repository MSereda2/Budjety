/*  BUDGET CONTROLLER */
var budgetController = (function() {
    // some code
})();

/*  UI CONTROLLER */
var UIcontroller = (function() {
    
    var DOMstrings = {
        inputType: `.add__type`,
        inputdescription: `.add__description`,
        inputValue: `.add__value`,
        addBtn: `.add__btn`
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // either + or -
                description: document.querySelector(DOMstrings.inputdescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        }


    }
})();

/*  APP CONTROLLER */
var appController = (function(budgetCtrl, UICtrl) {
    var DOM = UICtrl.getDOMstrings();

    var ctrlAddItem = function() {
        //1. Get the filed input data
        var input = UICtrl.getInput();
        console.log(input);
        //2. Add the item to the budget controller  
        console.log(DOM);
        //3. Add the item to the UI

        //4. Calculate the budget

        //5. Display budget
       
    }

    document.querySelector(DOM.addBtn).addEventListener(`click`, ctrlAddItem);

    document.addEventListener(`keypress`, function(event) {
        if(event.keyCode === 13) {
          ctrlAddItem();
        } 
    });

})(budgetController, UIcontroller);