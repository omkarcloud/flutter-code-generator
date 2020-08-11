import 'package:flutter/material.dart';

class Fruit extends StatefulWidget {
   final String name;
   final int index;

   Fruit(@required this.name,{@required this.index, Key key}) : super(key : key);

   bool sweet(String name,{int index, double rating}){
      print('Hello from sweet');
   }

   dynamic origin(){
      print('Hello from origin');
   }

   @override
   _FruitState createState(){
      return _FruitState();
   }

   @override
   bool operator ==(Object o){
      if (identical(this,o)) return true;
      return  o is Fruit && o.name == name && o.index == index;
   }

   @override
   String toString(){
      return 'Fruit {name: $name, index: $index}';
   }

}

class _FruitState extends State<Fruit> {

   @override
   Widget build(BuildContext context){
      return Container(child: Text("Hello from Fruit"),);
   }

}
