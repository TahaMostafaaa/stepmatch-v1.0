import { StyleSheet } from "react-native";
import {  SIZES } from "./theme";

export const GlobalStyleSheet = StyleSheet.create({
    headerBtn : {
        height:44,
        width:44,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:24,
    },
    homeHeader : {
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal:15,
        paddingVertical:10,
    },
    flexCenter: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    flexaling: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    container : {
        padding : 15,
        marginLeft : 'auto',
        marginRight : 'auto',
        width : '100%',
        maxWidth: SIZES.container,
    },
    row : {
        flexDirection : 'row',
        marginHorizontal : -5,
        flexWrap : 'wrap',
    },
    col33 : {
        width : '33.33%',
        paddingHorizontal : 5,
    },
    col66 : {
        width : '66.67%',
        paddingHorizontal : 5,
    },
    col50 : {
        width : '50%',
        paddingHorizontal : 5,
    },
    col100:{
        width : '100%',
        paddingHorizontal : 5,
    },
    card : {
        padding:15,
        borderRadius:SIZES.radius,
        marginBottom:15,
        borderWidth:1,
    },
    shadow : {
        shadowColor : "rgba(0,0,0,.5)",
        shadowOffset : {
            width:0,
            height:4,
        },
        shadowOpacity : .30,
        shadowRadius : 4.65,
        elevation : 8,
    },
    image: {
        width: 20,
        height: 20,
        tintColor: 'red',
        resizeMode: 'contain',
    },
    inputBox: {
        height: 50,
        borderRadius: 15,
        paddingLeft: 50,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'transparent'
    },
});