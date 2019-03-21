const PropertiesReader=require('properties-reader');
const properties=PropertiesReader('./dev.prop');
console.log(properties.getAllProperties());