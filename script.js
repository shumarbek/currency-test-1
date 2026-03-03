class Currency{
    #code; //USD, EUR, RUBL
    #rate; //USD=1, EUR=0.81
    constructor(code, rate){
        this.#code=code;
        this.#rate=rate;
    }
    get code(){
        return this.#code;

    }
    get rate(){
        return this.#rate;
    }
    display(){
        console.log("Displaying currency: ",this.#code, this.#rate)
    }
}

// const usd=new Currency("USD", 1);
// console.log(usd);
// console.log(usd.display())
// console.log(usd.rate)
class App{
    #list;
    #currencies;
    constructor(){
        this.#init();
    }
    async #init(){
        this.#list=document.getElementById("table-body");
        const response=await fetch("https://api.frankfurter.app/latest?from=USD");
        // console.log(response);
        const result=await response.json();
        // console.log(result);
        this.#transformResult(result);
    }
    #transformResult(result){
        const {base, amount, rates}=result;
        // console.log(base, amount, rate);
        const baseCurrency=new Currency(base, amount);
        // console.log(baseCurrency);
        const otherCurrencies=Object.entries(rates).map(([code, rate])=>new Currency(code, rate));
        console.log(otherCurrencies);
    }
}

new App();