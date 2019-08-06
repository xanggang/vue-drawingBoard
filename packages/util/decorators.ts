// export function After(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//   let oldValue = descriptor.value;
//   descriptor.value = function() {
//     target.getPreviewImgList.apply(this);
//     return oldValue.apply(this, arguments);
//   };
// }

export function After(key: string) {
  debugger
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let oldValue = descriptor.value;
    debugger
    descriptor.value = function() {
      console.log(arguments);
      oldValue.apply(this, arguments);
      target[key].apply(this, arguments);
      return oldValue.apply(this, arguments);
    };
  }
}
