
/**
 * A custom Vue Component used as contenteditable, to work with v-model.
 */
Vue.component('editable',{
    template: `
        <span contenteditable="true"
            spellcheck="off"
            autocorrect="off"
            autocomplete="off"
            class="contenteditable"
            v-once
            v-html="value" 
            :value="value" 
            @input="$emit('input', Number($event.target.innerHTML))">
        </span>
    `,
    props: ['value'],
    watch: {
        value(newValue) {
            if (document.activeElement == this.$el) {
                return;
            }
            this.$el.innerHTML = newValue;
        }
    },
});


var app = new Vue({
    el: '#app',
    data: {
        inputMegas: "", // how many megas do user want?
        inputMegasPrice: 10, // what is the price of the megas package?
        inputMegasForPrice: 250, // how much is offered in the megas package?

        calculatedPrice: "0", // calculated price based on the package
        calculatedMegas: "0", // calculated megas based on the package
    },
    computed: {
        /**
         * Check how much extra will the user get based on the calculated megas.
         */
        calculatedExtraMegas() {
            if (this.calculatedMegas < this.mb) {
                return 0
            }
            return this.calculatedMegas - this.mb;
        },

        /**
         * Just convert the input for a machine readable number
         */
        mb () {
            return this.toFloat(this.inputMegas)
        },

        /**
         * Just convert the input for a machine readable number
         */
        megasPrice() {
            return this.toFloat(this.inputMegasPrice)
        },

        /**
         * Just convert the input for a machine readable number
         */
        megasForPrice() {
            return this.toFloat(this.inputMegasForPrice)
        },

        /**
         * Class used to highlight the result when input megas
         */
        isResultActive: function() {
            return this.mb > 0;
        },
    },
    methods: {
        /**
         * Helper Method
         * Check if a given number is Float type or not.
         * @param {Number} n the number to check if float or not.
         */
        isFloat(n) {
            return n % 1 !== 0;
        },

        /**
         * Helper Method
         * Parse a number or a string to Float type. Will return 0 if NaN.
         * @param {Number|String} n the number to be parsed as Float
         */
        toFloat(n) {
            let megasF = parseFloat(n)
            return this.zeroIfNaN(megasF);
        },

        /**
         * Helper Method
         * Simply return 0 if not-a-number is given.
         * @param {Number|String} n the number or number string which can be NaN
         */
        zeroIfNaN(n) {
            if (isNaN(n)) {
                return 0;
            }
            return n;
        },

        /**
         * Calculate the megas and the price of megas the user wants to know.
         */
        onInputCalculate() {
            if (this.megasPrice <= 0 && this.megasForPrice <= 0) {
                // Cannot calculate. Reset the values
                this.calculatedPrice = 0;
                this.calculatedMegas = 0;
            }

            // Calculate how much money you will need for <inputMegas>, given <megasPrice> for <megasForPrice>
            const formula = (this.megasPrice * this.mb) / this.megasForPrice
            const ceil = Math.ceil(formula);
            const remainder = (ceil / this.megasPrice) - ((ceil / this.megasPrice) % 1);

            if (this.isFloat(ceil/this.megasPrice)) {
                this.calculatedPrice = this.zeroIfNaN((this.megasPrice * remainder) + this.megasPrice);
                this.calculatedMegas = this.zeroIfNaN((this.calculatedPrice / this.megasPrice) * this.megasForPrice);

            } else {
                this.calculatedPrice = this.zeroIfNaN((this.megasPrice * remainder));
                this.calculatedMegas = this.zeroIfNaN((this.calculatedPrice / this.megasPrice) * this.inputMegasForPrice);
            }
        }
    }
})