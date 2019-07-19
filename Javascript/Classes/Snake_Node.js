function Snake_Node(left, top) {
    this.left = left;
    this.top = top;

    this.next = null;

    this.animateFlag = 1; 
    
    this.moveNode = function(nLeft, nTop, prevFlag)
    {
        if (this.next != null)
            this.next.moveNode(this.left, this.top, this.animateFlag);
        this.left = nLeft;
        this.top = nTop;
        this.animateFlag = prevFlag;
    }

    
}