// function Car(name, carClass) {
//     this.name = name;
//     this.carClass = carClass;
// }

// Car.prototype.run = function () {
//     console.log(`vzzvzvzbzbzb bur bur bur ${this.name}`);
// };

// Car.count = 0;

// Car.counter = (count) => {
//     Car.count = count;
// };

// function Track(name, carClass, maxWeight) {
//     Car.call(this, name, carClass);
//     this.maxWeight = maxWeight;
// }

// Track{
//     prototype: {
//         contstructor: Track,
//             __proto__
//     }
// }


// Track.prototype = Object.create(Car.prototype);

// Track{
//     prototype: {
//         __proto__
//     }
// }
// Track.prototype.contstructor = Track
// Track{
//     prototype: {
//         constructor : function Track
//         __proto__
//     }
// }
// Track.prototype.fjnejrei

// Track.prototype.__proto__.contstructor()
// bmw.__proto__.__proto__.run()
// bmw.contstructor()
// delete bmw.__proto__.con
// new Track();
// const car = new Track.prototype.__proto__.contstructor();


// class Yana extends People{
//     constructor(weight, height, color,popaPlugger) {
//         super(weight, height, color);
//         this.#_popaPlugger = popaPlugger;
//     }
//     get weight() {
//         return 20;
//     }
//     get height() {
//         return this._height
//     }
//     get color() {
//         return this._color
//     }
//     get popaPlugger() {
//         return this.#popaPlugger
//     }


//     set popaPlugger(value) {
//         this.#popaPlugger = value
//     }
    
//     set #popaPlugger(value) {
//         this.#_popaPlugger = value
//     }

//     set weight(value) {
//         this.#popaPlugger = value
//         this._weight = 100
//     }
// }
// const yana = new Yana(52, 160, 'white', true);
// console.log(yana.weight);
// yana.weight= 50;


