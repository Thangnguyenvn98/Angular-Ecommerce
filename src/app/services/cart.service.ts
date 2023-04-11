import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject<Cart>({items:[]}) //Hold the initial Value, once we update, add new item to the array



  constructor(private _snackBar: MatSnackBar) { } //Displayed message add to cart successfully


  addToCart(item:CartItem):void{  //this is the method used in product-box-component
      const items = [...this.cart.value.items] //destructure to create new array, .value is from behavior Subeject, items match the product from cart

      const itemInCart = items.find((_item) => _item.id === item.id)

      if(itemInCart){
        itemInCart.quantity +=1
      }else {
        items.push(item) //item here is from the parameter above which is a value of CartItem object
      }


      this.cart.next({items}) //.next is also from behavior subject  method is used to emit a new value to all the subscribers of a
                              // BehaviorSubject instance. In other words, it is used to update the value of the BehaviorSubject.

      this._snackBar.open('1 item added to cart.','Ok',{duration: 3000})

      console.log(this.cart.value)
  }  



  getTotal(items:Array<CartItem>):number {
    return items.map((item) => item.price * item.quantity)  //reduce in order to add all items 
    .reduce((prev,current)=> prev + current,0)   //0 is the initial value
  }

  clearCart():void{
    this.cart.next({items: []})
    this._snackBar.open('Cart is Clear!','Ok',{duration: 3000})
  }
  
  removeFromCart(item: CartItem, update=true):Array<CartItem>{        //this method clear the whole array
    const filteredItems = this.cart.value.items.filter((_item) => _item.id !== item.id)

    if(update){
      this.cart.next({items: filteredItems})
      this._snackBar.open('Items is removed from cart.','Ok',{duration: 3000})
    }
    return  filteredItems

  }

  removeQuantity(item:CartItem):void{
    let itemForRemoval: CartItem | undefined
    let filteredItems = this.cart.value.items.map((_item) => {
      if(_item.id === item.id){
        _item.quantity--

        if(_item.quantity ===0){
          itemForRemoval = _item
        }

     
      }
      return _item
    })

    if(itemForRemoval){
      filteredItems = this.removeFromCart(itemForRemoval,false)
    }

    this.cart.next({items:filteredItems})
    this._snackBar.open('1 item is removed from cart.','Ok',{duration: 3000})

  }

}
