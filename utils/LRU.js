/*
* Least Recently Used Cache: Given a capacity, creates a cache that, when it
* reaches capacity, removes the least recently used entry. It does this by maintaining a
* Hash Map, for O(1) cache access, and a queue, implemented as a doubly linked list, for
* keeping track of the most and least recently used items
*/

class Node {
	constructor(key, val) {
		this.key = key;
		this.val = val;
		this.previous = null;
		this.next = null;
	}
}

class LRUCache {
	constructor(capacity) {
		this.capacity = capacity;
		this.size = 0;
		this.map = new Map();
		this.MRU = null;
		this.LRU = null;
	}

	contains(key) {
		return this.map.has(key);
	}

	getVal(key) {
		// If it's not in the cache, return null
		if (!this.map.has(key)) return null;

		// Get the node from the cache. If it's the MRU, just return the val
		let temp = this.map.get(key);
		if (temp.key === this.MRU.key) return this.MRU.val;

		// If it's the LRU, remove it from the queue and update the LRU
		let next = temp.next;
		let prev = temp.prev;
		if (temp.key === this.LRU.key) {
			next.previous = null;
			this.LRU = next;
		}

		// If it's in the middle, just remove it from the queue
		else {
			next.previous = prev;
			prev.next = next;
		}

		// Now we can put it at the rear of the queue and return the val
		temp.prev = this.MRU;
		this.MRU.next = temp;
		this.MRU = temp;
		this.MRU.next = null;

		return temp.val;
	}

	putVal(key, val) {
		// If it's already in the cache, return
		if (this.map.has(key)) return;

		// Create a new node, place it at the back of the queue, and put it in the cache
		let node = new Node(key, val);
		node.previous = this.MRU;
		if (this.MRU) this.MRU.next = node;
		this.MRU = node;
		this.map.set(key, node);

		// If we're at capacity, delete the LRU key from the cache, and remove it from the
		// front of the queue
		if (this.size === this.capacity) {
			this.map.delete(this.LRU.key);
			this.LRU = this.LRU.next;
			this.LRU.previous = null;
		}

		// Otherwise, update the LRU if size is 0, and increment the size. 
		else {
			if (this.size === 0) this.LRU = node;
			this.size++;
		}
	}
}

module.exports = LRUCache;