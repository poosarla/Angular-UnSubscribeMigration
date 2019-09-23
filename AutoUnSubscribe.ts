export function AutoUnsubscribe(constructor) {

    const original = constructor.prototype.ngOnDestroy;

    constructor.prototype.ngOnDestroy = function () {

        if (this.cmpSubscriber) {
            for (let prop in this.cmpSubscriber) {
                const property = this.cmpSubscriber[prop];
                if (property && (typeof property.unsubscribe === "function")) {
                    property.unsubscribe();
                }
            }
        }
        original && typeof original === "function" && original.apply(this, arguments);
    };

}
