function Snake_List() {
    this.length = 0;
    this.head = null;

    //moveSnake moves all of the nodes in the list accordingly
    this.moveSnake = function (point) {
        var flushLeft = this.head.left + point.X;
        var flushTop = this.head.top + point.Y;

        this.head.moveNode(flushLeft, flushTop, this.head.animateFlag);
        this.head.animateFlag = 1;
    };


    //SnakeIncrease acts as the Snake_List constructor, and also increase the snake's length every time it eats.
    this.snakeIncrease = function () {
        this.length++;
        if (this.head == null) {
            this.head = new Snake_Node(0, 0);
            return;
        }
        var tempNode = this.head;
        while (tempNode.next != null) {
            tempNode = tempNode.next;
        }
        tempNode.next = new Snake_Node(tempNode.left, tempNode.top);
    };


    //returns the snake node at a specific location.
    this.getNodeAt = function (number) {
        var index = this.head;
        var temp = number;

        while (temp != 0) {
            temp--;
            index = index.next;
        }
        return index;
    }

    //getKamikazi launches the recursion method which checks if the snake ate himself. IE if the head node's coordinates match another node. returns true or false based on the case.
    this.getKamikazi = function () {
        return this.matchCoordsRecursion(this.head.left, this.head.top, this.head.next)
    }
    this.matchCoordsRecursion = function (left, top, node) {
        if (node == null)
            return false;
        if ((node.left == left) && (node.top == top))
            return true;
        return this.matchCoordsRecursion(left, top, node.next);
    }

    this.getTail = function () {
        var temp = this.head;
        while(temp.next != null)
        {
            temp = temp.next;
        }
        return temp;
    }
    
}