// JSLint options:
/*jslint browser: true,
eqeqeq: true,
immed: false,
newcap: true,
nomen: false,
onevar: true,
plusplus: false,
undef: true,
white: false,
strict: false*/
/*global window, alert, dojo */

define(function(){
  console.log("thing");
  (function(d){
    d.fn = d.NodeList.prototype;
    d.plugin = function(pluginNamespace, fn, way){
      if(d[pluginNamespace]){
        console.warn("cowardly won't clobber '" + pluginNamespace + "' method");
        return fn;
      }
      var f = d[pluginNamespace] = fn;
      d.fn[pluginNamespace] = d.NodeList[way || "_adaptAsForEach"](f);
      return f;
    }
  })(dojo);

  function animateClass(args, mode){
    var elm = args.node,
        className = args.className,
        duration = args.duration || 500,
        easing = args.easing || null,
        onEnd = args.onEnd,
        copiedNode,
        currentStyles,
        newStyles,
        animProps = {},
        diffProps = [],
        prop,
        i,
        oldDisplayProp,
        toggleAction;

    //if args.node is a string, find the node
    if(typeof(args.node) === "string"){
      elm = dojo.byId(args.node);
    }

    function rewriteProperties(styleKeys){
      //rewrite properties like font-size:14px to fontSize:14
      //returns an object with the rewritten properties and their values

      var styles = {},
          sKey,
          value;

      function letterToUpperCase(all, letter){
          return letter.toUpperCase();
      }

      if(styleKeys.length){
        for(i=0; i<styleKeys.length; i++){
          sKey = styleKeys[i].replace(/\-(\w)/g, letterToUpperCase);

          if(styleKeys[sKey]){
            styles[sKey] = styleKeys[sKey].replace("px","");
          }
        }
      }
      else {
        //IE
        for(prop in styleKeys){
          value = styleKeys[prop]+"";
          styles[prop] = value.replace("px", "");
        }
      }

      return styles;
    }

    copiedNode = document.createElement(elm.tagName);
    if(mode === "addClass"){
      copiedNode.className = elm.className;
      dojo.addClass(copiedNode, className);
    }
    else if(mode === "removeClass"){
      copiedNode.className = elm.className;
      dojo.removeClass(copiedNode, className);
    }
    else if(mode === "toggleClass"){
      if(dojo.hasClass(elm, className)){
        toggleAction = "remove";
        copiedNode.className = elm.className;
        dojo.removeClass(copiedNode, className);
      }
      else {
        toggleAction = "add";
        copiedNode.className = elm.className;
        dojo.addClass(copiedNode, className);
      }
    }

    //add the copy to the DOM to calculate all the styles
    document.body.appendChild(copiedNode);
    oldDisplayProp = dojo.style(copiedNode, "display");
    dojo.style(copiedNode, "display", "none");

    //get the styles
    currentStyles = rewriteProperties(dojo.style(elm));
    newStyles = rewriteProperties(dojo.style(copiedNode));

    //set the display prop to how it was
    currentStyles.display = oldDisplayProp;
    newStyles.display = oldDisplayProp;

    //remove the copy from the DOM
    dojo.style(copiedNode, "display", oldDisplayProp);
    document.body.removeChild(copiedNode);

    //check which of the properties differ and create and object of those
    for(prop in newStyles){
      if(newStyles[prop] !== currentStyles[prop]){
        animProps[prop] = newStyles[prop];
        //create an array of the propnames to be able to reset the inline styles later on
        diffProps.push(prop);
      }
    }

    return dojo.animateProperty({
      node:elm,
      duration:duration || dojo.Animation.prototype.duration,
      easing: easing,
      properties: animProps,
      onEnd: function(){
        var i;

        if(mode === "addClass"){
          //add the new class
          dojo.addClass(elm, className);
        }
        else if(mode === "removeClass"){
          //remove the class
          dojo.removeClass(elm, className);
        }
        else if(mode === "toggleClass"){
          if(toggleAction === "add"){
            //add the new class
            dojo.addClass(elm, className);
          }
          else {
            //remove the class
            dojo.removeClass(elm, className);
          }
        }

        //remove inline styles
        for(i=0; i<diffProps.length; i++ ){
          dojo.style(elm, diffProps[i], "");
        }

        //execute onEnd function
        if(onEnd){
          onEnd();
        }
      }
    });
  }

  dojo.plugin("animateAddClass", function(args){
    return animateClass(args, "addClass");
  });

  dojo.plugin("animateRemoveClass", function(args){
    return animateClass(args, "removeClass");
  });

  dojo.plugin("animateToggleClass", function(args){
    return animateClass(args, "toggleClass");
  });
});
