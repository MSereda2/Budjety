/*  BUDGET CONTROLLER */
var budgetController = (function() {

  class Expence {
    constructor(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
  };

  class Income {
    constructor(id,description,value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
  };

  var calculateTotal = function(type) {
      var sum = 0;
      data.allItems[type].forEach(function(current) {
          sum = sum + current.value;
      });

      data.totals[type] = sum;
  }

  var data = {
      allItems: {
          exp: [],
          inc: []
        },
      totals: {
          exp: 0,
          inc: 0
        },
       budget: 0,
       precenteg: -1
  };
  

  return {
      addItem: function(type,des,value) {
            var newItem, id;

            // Create new id
            if(data.allItems[type].length > 0) {
                id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                id = 0;
            }

            // Create new item based on `inc` or `exp`
            if (type === `exp`) {
                newItem = new Expence(id,des,value);
            } else if (type === `inc` ) {
                newItem = new Income(id,des,value);
            }

            // Push new item to data structure
            data.allItems[type].push(newItem);
            return newItem;
           
      },

      calculateBudget: function(newItem) {
          // Calculate total income or expence
            calculateTotal(`exp`);
            calculateTotal(`inc`);
          // Calculate buddget: income - expence
            data.budget = data.totals.inc - data.totals.exp;
          // Calculate the precenteg
            if(data.totals.inc > 0) {
                data.precenteg = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.precenteg = -1;
            }
           
      },

      getBudget: function() {
          return {
              buddget: data.budget,
              totalInc: data.totals.inc,
              totalExp: data.totals.exp,
              precenteg: data.precenteg
          }
      },

      testing: function() {
          console.log(data);
      }
  }
  
})();


/*  UI CONTROLLER */
var UIcontroller = (function() {

  
    
    var DOMstrings = {
        inputType: `.add__type`,
        inputdescription: `.add__description`,
        inputValue: `.add__value`,
        addBtn: `.add__btn`,
        incomeContainer: `.income__list`,
        ExpenceContainer: `.expenses__list`
    }

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,  // either + or -
                description: document.querySelector(DOMstrings.inputdescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            }
        },

        getDOMstrings: function() {
            return DOMstrings;
        },

        addListItem: function(obj,type) {
            var html, element;
            // Create HTML string with placeholder text and replace to actual data
            if(type === `inc`) {
                element = DOMstrings.incomeContainer;
                html = ` <div class="item clearfix" id="income-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">+ ${obj.value}</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`;
            } else if(type === `exp`) {
                element = DOMstrings.ExpenceContainer;
                html = ` <div class="item clearfix" id="expense-${obj.id}">
                <div class="item__description">${obj.description}</div>
                <div class="right clearfix">
                    <div class="item__value">- ${obj.value}</div>
                    <div class="item__percentage">21%</div>
                    <div class="item__delete">
                        <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div>
                </div>
                </div>`;
            };

            // Insert the HTML into dom
            document.querySelector(element).insertAdjacentHTML(`beforeend`, html);
        },

        clearInput: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputdescription + `, ` + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields); // this line of code convert list to array

            fieldsArr.forEach(function(current, index, array) { // forEach has 3 parametrs for loop !!Current means element which is proseed right now a
                current.value = ""; // this line loop over our 2 elements and set to them value to empty
            });

            fieldsArr[0].focus();
        },

        updateBudget: function(data) {
            //1. Select DOM elements which we want to replace
            document.querySelector(`.budget__value`).textContent = data.budget;
        }


    }
})();

/*  APP CONTROLLER */
var appController = (function(budgetCtrl, UICtrl) {
   ;

    var setupEventListeners = function() {       
        var DOM = UICtrl.getDOMstrings(); // this only contains dom element offevent listener
        document.querySelector(DOM.addBtn).addEventListener(`click`, ctrlAddItem);

        document.addEventListener(`keypress`, function(event) {
            if(event.keyCode === 13) {
              ctrlAddItem();
            } 
        });
    };

    var updateBudget = function () {
        //1. Calculate the budget
        budgetCtrl.calculateBudget();

        //2. Return budget
        var budget = budgetCtrl.getBudget();
        console.log(budget);
        //2. Display budget
    }
   
    var ctrlAddItem = function() { /// call back
        //1. Get the filed input data
        var input = UICtrl.getInput();

        if(input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller  
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
  
            //3. Add the item to the UI
            UICtrl.addListItem(newItem,input.type);

            //4. Clear the fields
            UICtrl.clearInput();

            //5. Calculate and update budget
            updateBudget(budgetCtrl.data);
        } else {
            alert(`write correct data`)
        }
    }

    return {
        init: function() {
            console.log(`app has started`);
            setupEventListeners();
        }
    };

})(budgetController, UIcontroller);

appController.init();