const gui = {
  createElement: function(type, extended){
    let el = document.createElement(type)
    if(!extended)return el;
    let keys = Object.keys(extended)
    for(let x=0;x<keys.length;x++){
      let key=keys[x]
      if(key=='style'){
        let styles = Object.keys(extended.style)
        // console.log('style found',styles);
        for(let s=0;s<styles.length;s++){
          el.style[styles[s]]=extended.style[styles[s]]
        }
      }else {
        el[key]=extended[key]
      }
    }
    return el
  },
}
