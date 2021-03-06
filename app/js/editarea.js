////////////////////////////////////////////////////////////////////////////////////// 
// Editarea object
////////////////////////////////////////////////////////////////////////////////////// 
// This object represent the "edit area" where the user works.
// It is used to change the content of the editzone while preserving the caret position

Editarea = (function() {

	function Editarea(element_id) {
		this.element = $('#'+element_id);
		this.root_id = 'usergenerated'; // using id string because the element is not available in the dom at this point
        this.old_caret = false;
		this.caret     = false;
		console.log("[editarea.js] init");
	}

  	Editarea.prototype.enable = function(q) {
    	if(q == '?') {
    	  	return this.element.attr("contenteditable")  == 'true';
    	} else {
    		console.log("[editarea.js] enable editarea");
      		return this.element.attr("contenteditable",true);
    	}
  	}

	Editarea.prototype.disable = function(q) {
	    if(q == '?') { 
      		return this.element.attr("contenteditable")  == 'false';
    	} else {
    		console.log("[editarea.js] disable editarea");
      		this.element.attr("contenteditable",false);
    	}
  	}

  	Editarea.prototype.save_position = function() {
        this.old_caret = this.caret;
    	this.caret = this.get_position();
		console.log("[editarea.js] save_position: " + this.caret.node + ", " + this.caret.offset);
  	}


	Editarea.prototype.restore_position = function(old) {
        var caret = this.caret;
	    if(old){
            caret = this.old_caret;
	    }
		if (!caret.node) { return true; }
		console.log("[editarea.js] restore_position: " + caret.node + ", " + caret.offset);
	    var sel   = rangy.getSelection();
	    var range = rangy.createRange();
	    var node = XPathHelper.get_node_from_XPath(caret.node, $('#'+this.root_id));
	    var offset = caret.offset;

	    range.setStart(node, offset);
	    range.collapse();
	    sel.setSingleRange(range);
	}

	Editarea.prototype.get_position = function() {
    	var selection = rangy.getSelection();
    	var node = XPathHelper.get_XPath_from_node(selection.anchorNode, this.root_id);
    	var offset = selection.anchorOffset;
    	return { node: node, offset: offset }          
  	}

	Editarea.prototype.refresh = function(doc, obj) {
		this.save_position();
		if(obj){
			if(obj.action=='insertion'){
				if (obj.node == this.caret.node && obj.offset <= this.caret.offset){
					this.caret.offset += obj.content.length;
				}
			} else if (obj.action=='deletion'){
				if (obj.node == this.caret.node && obj.offset <= this.caret.offset && obj.direction=='left'){
					this.caret.offset -= obj.length;
				} else if (obj.node == this.caret.node && obj.offset <= this.caret.offset && obj.direction=='right'){
					this.caret.offset -= obj.length;
				}
			}
		}
		this.element.html(doc.content.clone());
		this.restore_position();
  	}  	

	return Editarea;
})();
