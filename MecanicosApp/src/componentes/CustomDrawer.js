import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import React from "react";
import {View, Text, StyleSheet} from "react-native"

const CustomDrawer = (props) =>{
    return (
        <DrawerContentScrollView
        >
            <View style={styles.container}>
                <Text style={styles.text} >Mecanicos App</Text>
                
            </View>
            <DrawerItemList {...props}/>
        </DrawerContentScrollView>
    )
 
}
const styles = StyleSheet.create({ container: {
    marginTop:25,
    marginBottom:25,
    borderBottomColor: 'grey',
    borderBottomWidth: StyleSheet.hairlineWidth,
 
 
  },
  text : 
  {
    textAlign: 'center',
    marginBottom: 25
  }
})
   

export default CustomDrawer;