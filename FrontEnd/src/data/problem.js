export const PROBLEMS = {
  "best-time-to-buy-and-sell-stock": {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array",
    description: {
      text: "You are given an array prices where prices[i] is the price of a given stock on the ith day.",
      notes: [
        "Choose one day to buy and a different future day to sell.",
        "Return the maximum profit.",
        "If no profit can be made, return 0."
      ]
    },
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy at 1 and sell at 6."
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0"
      }
    ],
    constraints: [
      "1 ≤ prices.length ≤ 10^5",
      "0 ≤ prices[i] ≤ 10^4"
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your solution here
  
}

// Test cases
console.log(maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log(maxProfit([7,6,4,3,1])); // Expected: 0`,
      python: `def maxProfit(prices):
    # Write your solution here
    pass

# Test cases
print(maxProfit([7,1,5,3,6,4]))  # Expected: 5
print(maxProfit([7,6,4,3,1]))  # Expected: 0`,
      java: `class Solution {
    public static int maxProfit(int[] prices) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7,1,5,3,6,4})); // Expected: 5
        System.out.println(maxProfit(new int[]{7,6,4,3,1})); // Expected: 0
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> p1 = {7, 1, 5, 3, 6, 4};
    cout << sol.maxProfit(p1) << endl;
    vector<int> p2 = {7, 6, 4, 3, 1};
    cout << sol.maxProfit(p2) << endl;
    return 0;
}`
    },
    expectedOutput: {
      javascript: "5\n0",
      python: "5\n0",
      java: "5\n0",
      cpp: "5\n0"
    }
  },

  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice in the array.",
      notes: [
        "Return false if every element is distinct."
      ]
    },
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true"
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10^5",
      "-10^9 ≤ nums[i] ≤ 10^9"
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
  // Write your solution here
  
}

// Test cases
console.log(containsDuplicate([1,2,3,1])); // Expected: true
console.log(containsDuplicate([1,2,3,4])); // Expected: false`,
      python: `def containsDuplicate(nums):
    # Write your solution here
    pass

# Test cases
print(containsDuplicate([1,2,3,1]))  # Expected: True
print(containsDuplicate([1,2,3,4]))  # Expected: False`,
      java: `class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1,2,3,1})); // Expected: true
        System.out.println(containsDuplicate(new int[]{1,2,3,4})); // Expected: false
    }
}`
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse"
    }
  },

  "maximum-product-subarray": {
    id: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "Given an integer array nums, find a subarray that has the largest product, and return the product.",
      notes: []
    },
    examples: [
      {
        input: "nums = [2,3,-2,4]",
        output: "6"
      },
      {
        input: "nums = [-2,0,-1]",
        output: "0"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 2 * 10^4",
      "-10 ≤ nums[i] ≤ 10"
    ],
    starterCode: {
      javascript: `function maxProduct(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxProduct([2,3,-2,4])); // Expected: 6
console.log(maxProduct([-2,0,-1])); // Expected: 0`,
      python: `def maxProduct(nums):
    # Write your solution here
    pass

# Test cases
print(maxProduct([2,3,-2,4]))  # Expected: 6
print(maxProduct([-2,0,-1]))  # Expected: 0`,
      java: `class Solution {
    public static int maxProduct(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(maxProduct(new int[]{2,3,-2,4})); // Expected: 6
        System.out.println(maxProduct(new int[]{-2,0,-1})); // Expected: 0
    }
}`
    },
    expectedOutput: {
      javascript: "6\n0",
      python: "6\n0",
      java: "6\n0"
    }
  },

  "find-minimum-in-rotated-sorted-array": {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times.",
      notes: [
        "Return the minimum element."
      ]
    },
    examples: [
      {
        input: "nums = [3,4,5,1,2]",
        output: "1"
      },
      {
        input: "nums = [4,5,6,7,0,1,2]",
        output: "0"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 5000",
      "-5000 ≤ nums[i] ≤ 5000"
    ],
    starterCode: {
      javascript: `function findMin(nums) {
  // Write your solution here
  
}

// Test cases
console.log(findMin([3,4,5,1,2])); // Expected: 1
console.log(findMin([4,5,6,7,0,1,2])); // Expected: 0`,
      python: `def findMin(nums):
    # Write your solution here
    pass

# Test cases
print(findMin([3,4,5,1,2]))  # Expected: 1
print(findMin([4,5,6,7,0,1,2]))  # Expected: 0`,
      java: `class Solution {
    public static int findMin(int[] nums) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(findMin(new int[]{3,4,5,1,2})); // Expected: 1
        System.out.println(findMin(new int[]{4,5,6,7,0,1,2})); // Expected: 0
    }
}`
    },
    expectedOutput: {
      javascript: "1\n0",
      python: "1\n0",
      java: "1\n0"
    }
  },

  "search-in-rotated-sorted-array": {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: {
      text: "There is an integer array nums sorted in ascending order with distinct values, but possibly rotated.",
      notes: [
        "Return the index of target if it exists, otherwise return -1."
      ]
    },
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4"
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 5000",
      "-10^4 ≤ nums[i], target ≤ 10^4"
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log(search([4,5,6,7,0,1,2], 3)); // Expected: -1`,
      python: `def search(nums, target):
    # Write your solution here
    pass

# Test cases
print(search([4,5,6,7,0,1,2], 0))  # Expected: 4
print(search([4,5,6,7,0,1,2], 3))  # Expected: -1`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }

    public static void main(String[] args) {
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 0)); // Expected: 4
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 3)); // Expected: -1
    }
}`
    },
    expectedOutput: {
      javascript: "4\n-1",
      python: "4\n-1",
      java: "4\n-1"
    }
  },

  "merge-intervals": {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Intervals",
    description: {
      text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
      notes: [
        "Return an array of the non-overlapping intervals."
      ]
    },
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]"
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]"
      }
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10^4",
      "intervals[i].length == 2"
    ],
    starterCode: {
      javascript: `function merge(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(merge([[1,3],[2,6],[8,10],[15,18]])); // Expected: [[1,6],[8,10],[15,18]]
console.log(merge([[1,4],[4,5]])); // Expected: [[1,5]]`,
      python: `def merge(intervals):
    # Write your solution here
    pass

# Test cases
print(merge([[1,3],[2,6],[8,10],[15,18]]))  # Expected: [[1,6],[8,10],[15,18]]
print(merge([[1,4],[4,5]]))  # Expected: [[1,5]]`,
      java: `import java.util.*;

class Solution {
    public static int[][] merge(int[][] intervals) {
        // Write your solution here
        return new int[0][0];
    }
}`
    },
    expectedOutput: {
      javascript: "[[1,6],[8,10],[15,18]]\n[[1,5]]",
      python: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]",
      java: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]"
    }
  },

  "insert-interval": {
    id: "insert-interval",
    title: "Insert Interval",
    difficulty: "Medium",
    category: "Intervals",
    description: {
      text: "You are given an array of non-overlapping intervals sorted by their start times.",
      notes: [
        "Insert a new interval and merge if necessary."
      ]
    },
    examples: [
      {
        input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
        output: "[[1,5],[6,9]]"
      },
      {
        input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
        output: "[[1,2],[3,10],[12,16]]"
      }
    ],
    constraints: [
      "0 ≤ intervals.length ≤ 10^4"
    ],
    starterCode: {
      javascript: `function insert(intervals, newInterval) {
  // Write your solution here
  
}

// Test cases
console.log(insert([[1,3],[6,9]], [2,5])); // Expected: [[1,5],[6,9]]`,
      python: `def insert(intervals, newInterval):
    # Write your solution here
    pass

# Test cases
print(insert([[1,3],[6,9]], [2,5]))  # Expected: [[1,5],[6,9]]`,
      java: `class Solution {
    public static int[][] insert(int[][] intervals, int[] newInterval) {
        // Write your solution here
        return new int[0][0];
    }
}`
    },
    expectedOutput: {
      javascript: "[[1,5],[6,9]]",
      python: "[[1, 5], [6, 9]]",
      java: "[[1, 5], [6, 9]]"
    }
  },

  "non-overlapping-intervals": {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    category: "Greedy",
    description: {
      text: "Given an array of intervals, return the minimum number of intervals you need to remove to make the rest non-overlapping.",
      notes: []
    },
    examples: [
      {
        input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        output: "1"
      },
      {
        input: "intervals = [[1,2],[1,2],[1,2]]",
        output: "2"
      }
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10^5"
    ],
    starterCode: {
      javascript: `function eraseOverlapIntervals(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])); // Expected: 1
console.log(eraseOverlapIntervals([[1,2],[1,2],[1,2]])); // Expected: 2`,
      python: `def eraseOverlapIntervals(intervals):
    # Write your solution here
    pass

# Test cases
print(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]))  # Expected: 1
print(eraseOverlapIntervals([[1,2],[1,2],[1,2]]))  # Expected: 2`,
      java: `class Solution {
    public static int eraseOverlapIntervals(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "1\n2",
      python: "1\n2",
      java: "1\n2"
    }
  },

  "meeting-rooms": {
    id: "meeting-rooms",
    title: "Meeting Rooms",
    difficulty: "Easy",
    category: "Intervals",
    description: {
      text: "Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings.",
      notes: []
    },
    examples: [
      {
        input: "intervals = [[0,30],[5,10],[15,20]]",
        output: "false"
      },
      {
        input: "intervals = [[7,10],[2,4]]",
        output: "true"
      }
    ],
    constraints: [
      "0 ≤ intervals.length ≤ 10^4"
    ],
    starterCode: {
      javascript: `function canAttendMeetings(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(canAttendMeetings([[0,30],[5,10],[15,20]])); // Expected: false
console.log(canAttendMeetings([[7,10],[2,4]])); // Expected: true`,
      python: `def canAttendMeetings(intervals):
    # Write your solution here
    pass

# Test cases
print(canAttendMeetings([[0,30],[5,10],[15,20]]))  # Expected: False
print(canAttendMeetings([[7,10],[2,4]]))  # Expected: True`,
      java: `class Solution {
    public static boolean canAttendMeetings(int[][] intervals) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "false\ntrue",
      python: "False\nTrue",
      java: "false\ntrue"
    }
  },

  "meeting-rooms-ii": {
    id: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    difficulty: "Medium",
    category: "Intervals",
    description: {
      text: "Given an array of meeting time intervals, return the minimum number of conference rooms required.",
      notes: []
    },
    examples: [
      {
        input: "intervals = [[0,30],[5,10],[15,20]]",
        output: "2"
      },
      {
        input: "intervals = [[7,10],[2,4]]",
        output: "1"
      }
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10^4"
    ],
    starterCode: {
      javascript: `function minMeetingRooms(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(minMeetingRooms([[0,30],[5,10],[15,20]])); // Expected: 2
console.log(minMeetingRooms([[7,10],[2,4]])); // Expected: 1`,
      python: `def minMeetingRooms(intervals):
    # Write your solution here
    pass

# Test cases
print(minMeetingRooms([[0,30],[5,10],[15,20]]))  # Expected: 2
print(minMeetingRooms([[7,10],[2,4]]))  # Expected: 1`,
      java: `class Solution {
    public static int minMeetingRooms(int[][] intervals) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "2\n1",
      python: "2\n1",
      java: "2\n1"
    }
  },

  "longest-common-prefix": {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Write a function to find the longest common prefix string amongst an array of strings.",
      notes: [
        "If there is no common prefix, return an empty string."
      ]
    },
    examples: [
      {
        input: 'strs = ["flower","flow","flight"]',
        output: '"fl"'
      },
      {
        input: 'strs = ["dog","racecar","car"]',
        output: '""'
      }
    ],
    constraints: [
      "1 ≤ strs.length ≤ 200",
      "0 ≤ strs[i].length ≤ 200"
    ],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {
  // Write your solution here
  
}

// Test cases
console.log(longestCommonPrefix(["flower","flow","flight"])); // Expected: "fl"
console.log(longestCommonPrefix(["dog","racecar","car"])); // Expected: ""`,
      python: `def longestCommonPrefix(strs):
    # Write your solution here
    pass

# Test cases
print(longestCommonPrefix(["flower","flow","flight"]))  # Expected: fl
print(longestCommonPrefix(["dog","racecar","car"]))  # Expected: ""`,
      java: `class Solution {
    public static String longestCommonPrefix(String[] strs) {
        // Write your solution here
        return "";
    }

    public static void main(String[] args) {
        System.out.println(longestCommonPrefix(new String[]{"flower","flow","flight"})); // Expected: fl
        System.out.println(longestCommonPrefix(new String[]{"dog","racecar","car"})); // Expected:
    }
}`
    },
    expectedOutput: {
      javascript: "fl\n",
      python: "fl\n",
      java: "fl\n"
    }
  },

  "valid-anagram": {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      notes: []
    },
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true"
      },
      {
        input: 's = "rat", t = "car"',
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ s.length, t.length ≤ 5 * 10^4"
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Write your solution here
  
}

// Test cases
console.log(isAnagram("anagram", "nagaram")); // Expected: true
console.log(isAnagram("rat", "car")); // Expected: false`,
      python: `def isAnagram(s, t):
    # Write your solution here
    pass

# Test cases
print(isAnagram("anagram", "nagaram"))  # Expected: True
print(isAnagram("rat", "car"))  # Expected: False`,
      java: `class Solution {
    public static boolean isAnagram(String s, String t) {
        // Write your solution here
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // Expected: true
        System.out.println(isAnagram("rat", "car")); // Expected: false
    }
}`
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse"
    }
  },

  "group-anagrams": {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "String",
    description: {
      text: "Given an array of strings strs, group the anagrams together.",
      notes: [
        "Return the answer in any order."
      ]
    },
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]'
      },
      {
        input: 'strs = [""]',
        output: '[[""]]'
      }
    ],
    constraints: [
      "1 ≤ strs.length ≤ 10^4"
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Write your solution here
  
}

// Test cases
console.log(groupAnagrams(["eat","tea","tan","ate","nat","bat"]));`,
      python: `def groupAnagrams(strs):
    # Write your solution here
    pass

# Test cases
print(groupAnagrams(["eat","tea","tan","ate","nat","bat"]))`,
      java: `import java.util.*;

class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    expectedOutput: {
      javascript: 'Example valid output: [["eat","tea","ate"],["tan","nat"],["bat"]]',
      python: "Example valid output: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]",
      java: "Example valid output: [[eat, tea, ate], [tan, nat], [bat]]"
    }
  },

  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: []
    },
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3"
      },
      {
        input: 's = "bbbbb"',
        output: "1"
      },
      {
        input: 's = "pwwkew"',
        output: "3"
      }
    ],
    constraints: [
      "0 ≤ s.length ≤ 5 * 10^4"
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Expected: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Expected: 3`,
      python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass

# Test cases
print(lengthOfLongestSubstring("abcabcbb"))  # Expected: 3
print(lengthOfLongestSubstring("bbbbb"))  # Expected: 1
print(lengthOfLongestSubstring("pwwkew"))  # Expected: 3`,
      java: `class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
        System.out.println(lengthOfLongestSubstring("bbbbb")); // Expected: 1
        System.out.println(lengthOfLongestSubstring("pwwkew")); // Expected: 3
    }
}`
    },
    expectedOutput: {
      javascript: "3\n1\n3",
      python: "3\n1\n3",
      java: "3\n1\n3"
    }
  },

  "longest-repeating-character-replacement": {
    id: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    difficulty: "Medium",
    category: "Sliding Window",
    description: {
      text: "You are given a string s and an integer k.",
      notes: [
        "You can choose any character of the string and change it to any other uppercase English character at most k times.",
        "Return the length of the longest substring containing the same letter."
      ]
    },
    examples: [
      {
        input: 's = "ABAB", k = 2',
        output: "4"
      },
      {
        input: 's = "AABABBA", k = 1',
        output: "4"
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 10^5"
    ],
    starterCode: {
      javascript: `function characterReplacement(s, k) {
  // Write your solution here
  
}

// Test cases
console.log(characterReplacement("ABAB", 2)); // Expected: 4
console.log(characterReplacement("AABABBA", 1)); // Expected: 4`,
      python: `def characterReplacement(s, k):
    # Write your solution here
    pass

# Test cases
print(characterReplacement("ABAB", 2))  # Expected: 4
print(characterReplacement("AABABBA", 1))  # Expected: 4`,
      java: `class Solution {
    public static int characterReplacement(String s, int k) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "4\n4",
      python: "4\n4",
      java: "4\n4"
    }
  },

  "minimum-window-substring": {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Sliding Window",
    description: {
      text: "Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window.",
      notes: [
        "If there is no such substring, return an empty string."
      ]
    },
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"'
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"'
      }
    ],
    constraints: [
      "1 ≤ s.length, t.length ≤ 10^5"
    ],
    starterCode: {
      javascript: `function minWindow(s, t) {
  // Write your solution here
  
}

// Test cases
console.log(minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log(minWindow("a", "a")); // Expected: "a"`,
      python: `def minWindow(s, t):
    # Write your solution here
    pass

# Test cases
print(minWindow("ADOBECODEBANC", "ABC"))  # Expected: BANC
print(minWindow("a", "a"))  # Expected: a`,
      java: `class Solution {
    public static String minWindow(String s, String t) {
        // Write your solution here
        return "";
    }`
    },
    expectedOutput: {
      javascript: "BANC\na",
      python: "BANC\na",
      java: "BANC\na"
    }
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: [
        "Every open bracket must be closed by the same type and in the correct order."
      ]
    },
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 10^4"
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}

// Test cases
console.log(isValid("()")); // Expected: true
console.log(isValid("()[]{}")); // Expected: true
console.log(isValid("(]")); // Expected: false`,
      python: `def isValid(s):
    # Write your solution here
    pass

# Test cases
print(isValid("()"))  # Expected: True
print(isValid("()[]{}"))  # Expected: True
print(isValid("(]"))  # Expected: False`,
      java: `class Solution {
    public static boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true\ntrue\nfalse",
      python: "True\nTrue\nFalse",
      java: "true\ntrue\nfalse"
    }
  },

  "min-stack": {
    id: "min-stack",
    title: "Min Stack",
    difficulty: "Medium",
    category: "Stack",
    description: {
      text: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      notes: []
    },
    examples: [
      {
        input: '["MinStack","push","push","push","getMin","pop","top","getMin"]',
        output: "[null,null,null,null,-3,null,0,-2]"
      }
    ],
    constraints: [
      "Methods pop, top and getMin operations will always be called on non-empty stacks."
    ],
    starterCode: {
      javascript: `class MinStack {
  constructor() {
    // Write your solution here
  }

  push(val) {}

  pop() {}

  top() {}

  getMin() {}
}`,
      python: `class MinStack:
    def __init__(self):
        # Write your solution here
        pass

    def push(self, val):
        pass

    def pop(self):
        pass

    def top(self):
        pass

    def getMin(self):
        pass`,
      java: `class MinStack {
    public MinStack() {
        // Write your solution here
    }

    public void push(int val) {}

    public void pop() {}

    public int top() { return 0; }

    public int getMin() { return 0; }
}`
    },
    expectedOutput: {
      javascript: "[null,null,null,null,-3,null,0,-2]",
      python: "[None,None,None,None,-3,None,0,-2]",
      java: "[null,null,null,null,-3,null,0,-2]"
    }
  },

  "daily-temperatures": {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Stack",
    description: {
      text: "Given an array of integers temperatures, return an array answer such that answer[i] is the number of days until a warmer temperature.",
      notes: [
        "If there is no future day, keep 0."
      ]
    },
    examples: [
      {
        input: "temperatures = [73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]"
      },
      {
        input: "temperatures = [30,40,50,60]",
        output: "[1,1,1,0]"
      }
    ],
    constraints: [
      "1 ≤ temperatures.length ≤ 10^5"
    ],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {
  // Write your solution here
  
}

// Test cases
console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // Expected: [1,1,4,2,1,1,0,0]`,
      python: `def dailyTemperatures(temperatures):
    # Write your solution here
    pass

# Test cases
print(dailyTemperatures([73,74,75,71,69,72,76,73]))  # Expected: [1,1,4,2,1,1,0,0]`,
      java: `class Solution {
    public static int[] dailyTemperatures(int[] temperatures) {
        // Write your solution here
        return new int[0];
    }
}`
    },
    expectedOutput: {
      javascript: "[1,1,4,2,1,1,0,0]",
      python: "[1, 1, 4, 2, 1, 1, 0, 0]",
      java: "[1, 1, 4, 2, 1, 1, 0, 0]"
    }
  },

  "evaluate-reverse-polish-notation": {
    id: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    difficulty: "Medium",
    category: "Stack",
    description: {
      text: "Evaluate the value of an arithmetic expression in Reverse Polish Notation.",
      notes: [
        "Valid operators are +, -, *, and /."
      ]
    },
    examples: [
      {
        input: 'tokens = ["2","1","+","3","*"]',
        output: "9"
      },
      {
        input: 'tokens = ["4","13","5","/","+"]',
        output: "6"
      }
    ],
    constraints: [
      "1 ≤ tokens.length ≤ 10^4"
    ],
    starterCode: {
      javascript: `function evalRPN(tokens) {
  // Write your solution here
  
}

// Test cases
console.log(evalRPN(["2","1","+","3","*"])); // Expected: 9
console.log(evalRPN(["4","13","5","/","+"])); // Expected: 6`,
      python: `def evalRPN(tokens):
    # Write your solution here
    pass

# Test cases
print(evalRPN(["2","1","+","3","*"]))  # Expected: 9
print(evalRPN(["4","13","5","/","+"]))  # Expected: 6`,
      java: `class Solution {
    public static int evalRPN(String[] tokens) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "9\n6",
      python: "9\n6",
      java: "9\n6"
    }
  },

  "linked-list-cycle": {
    id: "linked-list-cycle",
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
      notes: []
    },
    examples: [
      {
        input: "head = [3,2,0,-4], pos = 1",
        output: "true"
      },
      {
        input: "head = [1], pos = -1",
        output: "false"
      }
    ],
    constraints: [
      "The number of nodes is in the range [0, 10^4]."
    ],
    starterCode: {
      javascript: `function hasCycle(head) {
  // Write your solution here
  
}

// Use your own ListNode class for testing`,
      python: `def hasCycle(head):
    # Write your solution here
    pass

# Use your own ListNode class for testing`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int x) {
        val = x;
        next = null;
    }
}

class Solution {
    public static boolean hasCycle(ListNode head) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true / false depending on input",
      python: "True / False depending on input",
      java: "true / false depending on input"
    }
  },

  "reverse-linked-list": {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "Given the head of a singly linked list, reverse the list and return the reversed list.",
      notes: []
    },
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]"
      },
      {
        input: "head = [1,2]",
        output: "[2,1]"
      }
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000]."
    ],
    starterCode: {
      javascript: `function reverseList(head) {
  // Write your solution here
  
}

// Use your own ListNode class for testing`,
      python: `def reverseList(head):
    # Write your solution here
    pass

# Use your own ListNode class for testing`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode reverseList(ListNode head) {
        // Write your solution here
        return null;
    }
}`
    },
    expectedOutput: {
      javascript: "Reversed linked list head",
      python: "Reversed linked list head",
      java: "Reversed linked list head"
    }
  },

  "merge-two-sorted-lists": {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "Merge two sorted linked lists and return the merged sorted list.",
      notes: []
    },
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]."
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Write your solution here
  
}

// Use your own ListNode class for testing`,
      python: `def mergeTwoLists(list1, list2):
    # Write your solution here
    pass

# Use your own ListNode class for testing`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
        return null;
    }
}`
    },
    expectedOutput: {
      javascript: "Merged sorted linked list",
      python: "Merged sorted linked list",
      java: "Merged sorted linked list"
    }
  },

  "remove-nth-node-from-end-of-list": {
    id: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "Given the head of a linked list, remove the nth node from the end and return its head.",
      notes: []
    },
    examples: [
      {
        input: "head = [1,2,3,4,5], n = 2",
        output: "[1,2,3,5]"
      },
      {
        input: "head = [1], n = 1",
        output: "[]"
      }
    ],
    constraints: [
      "The number of nodes in the list is sz.",
      "1 ≤ sz ≤ 30"
    ],
    starterCode: {
      javascript: `function removeNthFromEnd(head, n) {
  // Write your solution here
  
}

// Use your own ListNode class for testing`,
      python: `def removeNthFromEnd(head, n):
    # Write your solution here
    pass

# Use your own ListNode class for testing`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode removeNthFromEnd(ListNode head, int n) {
        // Write your solution here
        return null;
    }
}`
    },
    expectedOutput: {
      javascript: "Modified linked list head",
      python: "Modified linked list head",
      java: "Modified linked list head"
    }
  },

  "reorder-list": {
    id: "reorder-list",
    title: "Reorder List",
    difficulty: "Medium",
    category: "Linked List",
    description: {
      text: "You are given the head of a singly linked-list. Reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...",
      notes: [
        "Do not return anything. Modify head in-place."
      ]
    },
    examples: [
      {
        input: "head = [1,2,3,4]",
        output: "[1,4,2,3]"
      },
      {
        input: "head = [1,2,3,4,5]",
        output: "[1,5,2,4,3]"
      }
    ],
    constraints: [
      "1 ≤ number of nodes ≤ 5 * 10^4"
    ],
    starterCode: {
      javascript: `function reorderList(head) {
  // Write your solution here
  
}

// Use your own ListNode class for testing`,
      python: `def reorderList(head):
    # Write your solution here
    pass

# Use your own ListNode class for testing`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static void reorderList(ListNode head) {
        // Write your solution here
    }
}`
    },
    expectedOutput: {
      javascript: "List modified in-place",
      python: "List modified in-place",
      java: "List modified in-place"
    }
  },

  "binary-tree-level-order-traversal": {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Tree",
    description: {
      text: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
      notes: []
    },
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]"
      },
      {
        input: "root = [1]",
        output: "[[1]]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000]."
    ],
    starterCode: {
      javascript: `function levelOrder(root) {
  // Write your solution here
  
}

// Use your own TreeNode class for testing`,
      python: `def levelOrder(root):
    # Write your solution here
    pass

# Use your own TreeNode class for testing`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    expectedOutput: {
      javascript: '[[3],[9,20],[15,7]]',
      python: '[[3], [9, 20], [15, 7]]',
      java: '[[3], [9, 20], [15, 7]]'
    }
  },

  "binary-tree-right-side-view": {
    id: "binary-tree-right-side-view",
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    category: "Tree",
    description: {
      text: "Given the root of a binary tree, imagine yourself standing on the right side of it.",
      notes: [
        "Return the values of the nodes you can see ordered from top to bottom."
      ]
    },
    examples: [
      {
        input: "root = [1,2,3,null,5,null,4]",
        output: "[1,3,4]"
      },
      {
        input: "root = [1,null,3]",
        output: "[1,3]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100]."
    ],
    starterCode: {
      javascript: `function rightSideView(root) {
  // Write your solution here
  
}

// Use your own TreeNode class for testing`,
      python: `def rightSideView(root):
    # Write your solution here
    pass

# Use your own TreeNode class for testing`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static List<Integer> rightSideView(TreeNode root) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    expectedOutput: {
      javascript: "[1,3,4]",
      python: "[1, 3, 4]",
      java: "[1, 3, 4]"
    }
  },

  "balanced-binary-tree": {
    id: "balanced-binary-tree",
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    description: {
      text: "Given a binary tree, determine if it is height-balanced.",
      notes: []
    },
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "true"
      },
      {
        input: "root = [1,2,2,3,3,null,null,4,4]",
        output: "false"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 5000]."
    ],
    starterCode: {
      javascript: `function isBalanced(root) {
  // Write your solution here
  
}

// Use your own TreeNode class for testing`,
      python: `def isBalanced(root):
    # Write your solution here
    pass

# Use your own TreeNode class for testing`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static boolean isBalanced(TreeNode root) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true / false depending on input",
      python: "True / False depending on input",
      java: "true / false depending on input"
    }
  },

  "diameter-of-binary-tree": {
    id: "diameter-of-binary-tree",
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    description: {
      text: "Given the root of a binary tree, return the length of the diameter of the tree.",
      notes: [
        "The diameter is the length of the longest path between any two nodes."
      ]
    },
    examples: [
      {
        input: "root = [1,2,3,4,5]",
        output: "3"
      },
      {
        input: "root = [1,2]",
        output: "1"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 10^4]."
    ],
    starterCode: {
      javascript: `function diameterOfBinaryTree(root) {
  // Write your solution here
  
}

// Use your own TreeNode class for testing`,
      python: `def diameterOfBinaryTree(root):
    # Write your solution here
    pass

# Use your own TreeNode class for testing`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static int diameterOfBinaryTree(TreeNode root) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "3\n1",
      python: "3\n1",
      java: "3\n1"
    }
  },

  "subtree-of-another-tree": {
    id: "subtree-of-another-tree",
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    category: "Tree",
    description: {
      text: "Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values of subRoot.",
      notes: []
    },
    examples: [
      {
        input: "root = [3,4,5,1,2], subRoot = [4,1,2]",
        output: "true"
      },
      {
        input: "root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]",
        output: "false"
      }
    ],
    constraints: [
      "The number of nodes in the root tree is in the range [1, 2000]."
    ],
    starterCode: {
      javascript: `function isSubtree(root, subRoot) {
  // Write your solution here
  
}

// Use your own TreeNode class for testing`,
      python: `def isSubtree(root, subRoot):
    # Write your solution here
    pass

# Use your own TreeNode class for testing`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static boolean isSubtree(TreeNode root, TreeNode subRoot) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true / false depending on input",
      python: "True / False depending on input",
      java: "true / false depending on input"
    }
  },

  "invert-binary-tree": {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Tree",
    description: {
      text: "Given the root of a binary tree, invert the tree, and return its root.",
      notes: []
    },
    examples: [
      {
        input: "root = [4,2,7,1,3,6,9]",
        output: "[4,7,2,9,6,3,1]"
      },
      {
        input: "root = [2,1,3]",
        output: "[2,3,1]"
      }
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 100]."
    ],
    starterCode: {
      javascript: `function invertTree(root) {
  // Write your solution here
  
}

// Use your own TreeNode class for testing`,
      python: `def invertTree(root):
    # Write your solution here
    pass

# Use your own TreeNode class for testing`,
      java: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static TreeNode invertTree(TreeNode root) {
        // Write your solution here
        return null;
    }
}`
    },
    expectedOutput: {
      javascript: "Inverted tree root",
      python: "Inverted tree root",
      java: "Inverted tree root"
    }
  },

  "number-of-islands": {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Graph",
    description: {
      text: "Given an m x n 2D binary grid grid which represents a map of '1's and '0's, return the number of islands.",
      notes: []
    },
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1"
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3"
      }
    ],
    constraints: [
      "1 ≤ m, n ≤ 300"
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your solution here
  
}

// Test cases
console.log(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
])); // Expected: 1`,
      python: `def numIslands(grid):
    # Write your solution here
    pass

# Test cases
print(numIslands([
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]))  # Expected: 1`,
      java: `class Solution {
    public static int numIslands(char[][] grid) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "1",
      python: "1",
      java: "1"
    }
  },

  "clone-graph": {
    id: "clone-graph",
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graph",
    description: {
      text: "Given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
      notes: []
    },
    examples: [
      {
        input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
        output: "[[2,4],[1,3],[2,4],[1,3]]"
      },
      {
        input: "adjList = []",
        output: "[]"
      }
    ],
    constraints: [
      "The number of nodes in the graph is in the range [0, 100]."
    ],
    starterCode: {
      javascript: `function cloneGraph(node) {
  // Write your solution here
  
}

// Use your own Node class for testing`,
      python: `def cloneGraph(node):
    # Write your solution here
    pass

# Use your own Node class for testing`,
      java: `class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
}

class Solution {
    public Node cloneGraph(Node node) {
        // Write your solution here
        return null;
    }
}`
    },
    expectedOutput: {
      javascript: "Deep copied graph root",
      python: "Deep copied graph root",
      java: "Deep copied graph root"
    }
  },

  "course-schedule": {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graph",
    description: {
      text: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.",
      notes: [
        "Prerequisites are given as pairs [a, b], meaning you must take b before a.",
        "Return true if you can finish all courses."
      ]
    },
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true"
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ numCourses ≤ 2000"
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  // Write your solution here
  
}

// Test cases
console.log(canFinish(2, [[1,0]])); // Expected: true
console.log(canFinish(2, [[1,0],[0,1]])); // Expected: false`,
      python: `def canFinish(numCourses, prerequisites):
    # Write your solution here
    pass

# Test cases
print(canFinish(2, [[1,0]]))  # Expected: True
print(canFinish(2, [[1,0],[0,1]]))  # Expected: False`,
      java: `class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse"
    }
  },

  "rotting-oranges": {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    difficulty: "Medium",
    category: "Graph",
    description: {
      text: "You are given an m x n grid where each cell can have one of three values: 0, 1, or 2.",
      notes: [
        "0 = empty, 1 = fresh orange, 2 = rotten orange.",
        "Every minute, any fresh orange adjacent to a rotten orange becomes rotten.",
        "Return the minimum number of minutes until no fresh orange remains, or -1 if impossible."
      ]
    },
    examples: [
      {
        input: "grid = [[2,1,1],[1,1,0],[0,1,1]]",
        output: "4"
      },
      {
        input: "grid = [[2,1,1],[0,1,1],[1,0,1]]",
        output: "-1"
      }
    ],
    constraints: [
      "1 ≤ m, n ≤ 10"
    ],
    starterCode: {
      javascript: `function orangesRotting(grid) {
  // Write your solution here
  
}

// Test cases
console.log(orangesRotting([[2,1,1],[1,1,0],[0,1,1]])); // Expected: 4
console.log(orangesRotting([[2,1,1],[0,1,1],[1,0,1]])); // Expected: -1`,
      python: `def orangesRotting(grid):
    # Write your solution here
    pass

# Test cases
print(orangesRotting([[2,1,1],[1,1,0],[0,1,1]]))  # Expected: 4
print(orangesRotting([[2,1,1],[0,1,1],[1,0,1]]))  # Expected: -1`,
      java: `class Solution {
    public static int orangesRotting(int[][] grid) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "4\n-1",
      python: "4\n-1",
      java: "4\n-1"
    }
  },

  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top.",
      notes: [
        "Each time you can climb 1 or 2 steps.",
        "Return how many distinct ways you can reach the top."
      ]
    },
    examples: [
      {
        input: "n = 2",
        output: "2"
      },
      {
        input: "n = 3",
        output: "3"
      }
    ],
    constraints: [
      "1 ≤ n ≤ 45"
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your solution here
  
}

// Test cases
console.log(climbStairs(2)); // Expected: 2
console.log(climbStairs(3)); // Expected: 3`,
      python: `def climbStairs(n):
    # Write your solution here
    pass

# Test cases
print(climbStairs(2))  # Expected: 2
print(climbStairs(3))  # Expected: 3`,
      java: `class Solution {
    public static int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "2\n3",
      python: "2\n3",
      java: "2\n3"
    }
  },

  "house-robber": {
    id: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "You are a professional robber planning to rob houses along a street.",
      notes: [
        "Adjacent houses cannot be robbed on the same night.",
        "Return the maximum amount you can rob."
      ]
    },
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4"
      },
      {
        input: "nums = [2,7,9,3,1]",
        output: "12"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 100"
    ],
    starterCode: {
      javascript: `function rob(nums) {
  // Write your solution here
  
}

// Test cases
console.log(rob([1,2,3,1])); // Expected: 4
console.log(rob([2,7,9,3,1])); // Expected: 12`,
      python: `def rob(nums):
    # Write your solution here
    pass

# Test cases
print(rob([1,2,3,1]))  # Expected: 4
print(rob([2,7,9,3,1]))  # Expected: 12`,
      java: `class Solution {
    public static int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "4\n12",
      python: "4\n12",
      java: "4\n12"
    }
  },

  "house-robber-ii": {
    id: "house-robber-ii",
    title: "House Robber II",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "All houses are arranged in a circle. Adjacent houses cannot be robbed.",
      notes: [
        "Return the maximum amount you can rob."
      ]
    },
    examples: [
      {
        input: "nums = [2,3,2]",
        output: "3"
      },
      {
        input: "nums = [1,2,3,1]",
        output: "4"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 100"
    ],
    starterCode: {
      javascript: `function rob(nums) {
  // Write your solution here
  
}

// Test cases
console.log(rob([2,3,2])); // Expected: 3
console.log(rob([1,2,3,1])); // Expected: 4`,
      python: `def rob(nums):
    # Write your solution here
    pass

# Test cases
print(rob([2,3,2]))  # Expected: 3
print(rob([1,2,3,1]))  # Expected: 4`,
      java: `class Solution {
    public static int rob(int[] nums) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "3\n4",
      python: "3\n4",
      java: "3\n4"
    }
  },

  "coin-change": {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "You are given an integer array coins representing coins of different denominations and an integer amount.",
      notes: [
        "Return the fewest number of coins needed to make up that amount.",
        "If it is not possible, return -1."
      ]
    },
    examples: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3"
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1"
      }
    ],
    constraints: [
      "1 ≤ coins.length ≤ 12",
      "0 ≤ amount ≤ 10^4"
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Write your solution here
  
}

// Test cases
console.log(coinChange([1,2,5], 11)); // Expected: 3
console.log(coinChange([2], 3)); // Expected: -1`,
      python: `def coinChange(coins, amount):
    # Write your solution here
    pass

# Test cases
print(coinChange([1,2,5], 11))  # Expected: 3
print(coinChange([2], 3))  # Expected: -1`,
      java: `class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "3\n-1",
      python: "3\n-1",
      java: "3\n-1"
    }
  },

  "longest-increasing-subsequence": {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
      notes: []
    },
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4"
      },
      {
        input: "nums = [0,1,0,3,2,3]",
        output: "4"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 2500"
    ],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {
  // Write your solution here
  
}

// Test cases
console.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // Expected: 4
console.log(lengthOfLIS([0,1,0,3,2,3])); // Expected: 4`,
      python: `def lengthOfLIS(nums):
    # Write your solution here
    pass

# Test cases
print(lengthOfLIS([10,9,2,5,3,7,101,18]))  # Expected: 4
print(lengthOfLIS([0,1,0,3,2,3]))  # Expected: 4`,
      java: `class Solution {
    public static int lengthOfLIS(int[] nums) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "4\n4",
      python: "4\n4",
      java: "4\n4"
    }
  },

  "word-break": {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: {
      text: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
      notes: []
    },
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true"
      },
      {
        input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]',
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ s.length ≤ 300"
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
  // Write your solution here
  
}

// Test cases
console.log(wordBreak("leetcode", ["leet","code"])); // Expected: true
console.log(wordBreak("catsandog", ["cats","dog","sand","and","cat"])); // Expected: false`,
      python: `def wordBreak(s, wordDict):
    # Write your solution here
    pass

# Test cases
print(wordBreak("leetcode", ["leet","code"]))  # Expected: True
print(wordBreak("catsandog", ["cats","dog","sand","and","cat"]))  # Expected: False`,
      java: `import java.util.*;

class Solution {
    public static boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse"
    }
  },

  "combination-sum": {
    id: "combination-sum",
    title: "Combination Sum",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an array of distinct integers candidates and a target integer target, return all unique combinations where the chosen numbers sum to target.",
      notes: [
        "You may use the same number multiple times."
      ]
    },
    examples: [
      {
        input: "candidates = [2,3,6,7], target = 7",
        output: "[[2,2,3],[7]]"
      },
      {
        input: "candidates = [2,3,5], target = 8",
        output: "[[2,2,2,2],[2,3,3],[3,5]]"
      }
    ],
    constraints: [
      "1 ≤ candidates.length ≤ 30"
    ],
    starterCode: {
      javascript: `function combinationSum(candidates, target) {
  // Write your solution here
  
}

// Test cases
console.log(combinationSum([2,3,6,7], 7));`,
      python: `def combinationSum(candidates, target):
    # Write your solution here
    pass

# Test cases
print(combinationSum([2,3,6,7], 7))`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    expectedOutput: {
      javascript: "Example valid output: [[2,2,3],[7]]",
      python: "Example valid output: [[2, 2, 3], [7]]",
      java: "Example valid output: [[2, 2, 3], [7]]"
    }
  },

  "permutations": {
    id: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an array nums of distinct integers, return all the possible permutations.",
      notes: [
        "You can return the answer in any order."
      ]
    },
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"
      },
      {
        input: "nums = [0,1]",
        output: "[[0,1],[1,0]]"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 6"
    ],
    starterCode: {
      javascript: `function permute(nums) {
  // Write your solution here
  
}

// Test cases
console.log(permute([1,2,3]));`,
      python: `def permute(nums):
    # Write your solution here
    pass

# Test cases
print(permute([1,2,3]))`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> permute(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    expectedOutput: {
      javascript: "Example valid output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      python: "Example valid output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
      java: "Example valid output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]"
    }
  },

  "subsets": {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an integer array nums of unique elements, return all possible subsets.",
      notes: [
        "The solution set must not contain duplicate subsets."
      ]
    },
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]"
      },
      {
        input: "nums = [0]",
        output: "[[],[0]]"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10"
    ],
    starterCode: {
      javascript: `function subsets(nums) {
  // Write your solution here
  
}

// Test cases
console.log(subsets([1,2,3]));`,
      python: `def subsets(nums):
    # Write your solution here
    pass

# Test cases
print(subsets([1,2,3]))`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> subsets(int[] nums) {
        // Write your solution here
        return new ArrayList<>();
    }
}`
    },
    expectedOutput: {
      javascript: "Example valid output: [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]",
      python: "Example valid output: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]",
      java: "Example valid output: [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]"
    }
  },

  "word-search": {
    id: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    category: "Backtracking",
    description: {
      text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      notes: [
        "The word can be constructed from sequentially adjacent cells."
      ]
    },
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true"
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: "false"
      }
    ],
    constraints: [
      "1 ≤ m, n ≤ 6"
    ],
    starterCode: {
      javascript: `function exist(board, word) {
  // Write your solution here
  
}

// Test cases
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")); // Expected: true
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB")); // Expected: false`,
      python: `def exist(board, word):
    # Write your solution here
    pass

# Test cases
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"))  # Expected: True
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"))  # Expected: False`,
      java: `class Solution {
    public static boolean exist(char[][] board, String word) {
        // Write your solution here
        return false;
    }
}`
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse"
    }
  },

  "kth-largest-element-in-an-array": {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "Given an integer array nums and an integer k, return the kth largest element in the array.",
      notes: [
        "It is the kth largest in sorted order, not the kth distinct element."
      ]
    },
    examples: [
      {
        input: "nums = [3,2,1,5,6,4], k = 2",
        output: "5"
      },
      {
        input: "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        output: "4"
      }
    ],
    constraints: [
      "1 ≤ k ≤ nums.length ≤ 10^5"
    ],
    starterCode: {
      javascript: `function findKthLargest(nums, k) {
  // Write your solution here
  
}

// Test cases
console.log(findKthLargest([3,2,1,5,6,4], 2)); // Expected: 5
console.log(findKthLargest([3,2,3,1,2,4,5,5,6], 4)); // Expected: 4`,
      python: `def findKthLargest(nums, k):
    # Write your solution here
    pass

# Test cases
print(findKthLargest([3,2,1,5,6,4], 2))  # Expected: 5
print(findKthLargest([3,2,3,1,2,4,5,5,6], 4))  # Expected: 4`,
      java: `class Solution {
    public static int findKthLargest(int[] nums, int k) {
        // Write your solution here
        return 0;
    }
}`
    },
    expectedOutput: {
      javascript: "5\n4",
      python: "5\n4",
      java: "5\n4"
    }
  },

  "top-k-frequent-elements": {
    id: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Heap",
    description: {
      text: "Given an integer array nums and an integer k, return the k most frequent elements.",
      notes: [
        "Return the answer in any order."
      ]
    },
    examples: [
      {
        input: "nums = [1,1,1,2,2,3], k = 2",
        output: "[1,2]"
      },
      {
        input: "nums = [1], k = 1",
        output: "[1]"
      }
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10^5"
    ],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {
  // Write your solution here
  
}

// Test cases
console.log(topKFrequent([1,1,1,2,2,3], 2)); // Expected: [1,2]`,
      python: `def topKFrequent(nums, k):
    # Write your solution here
    pass

# Test cases
print(topKFrequent([1,1,1,2,2,3], 2))  # Expected: [1,2]`,
      java: `class Solution {
    public static int[] topKFrequent(int[] nums, int k) {
        // Write your solution here
        return new int[0];
    }
}`
    },
    expectedOutput: {
      javascript: "Example valid output: [1,2]",
      python: "Example valid output: [1, 2]",
      java: "Example valid output: [1, 2]"
    }
  },

  "find-median-from-data-stream": {
    id: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    category: "Heap",
    description: {
      text: "The median is the middle value in an ordered integer list.",
      notes: [
        "Design a data structure that supports adding integers and finding the median."
      ]
    },
    examples: [
      {
        input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]',
        output: "[null,null,null,1.5,null,2.0]"
      }
    ],
    constraints: [
      "-10^5 ≤ num ≤ 10^5"
    ],
    starterCode: {
      javascript: `class MedianFinder {
  constructor() {
    // Write your solution here
  }

  addNum(num) {}

  findMedian() {}
}`,
      python: `class MedianFinder:
    def __init__(self):
        # Write your solution here
        pass

    def addNum(self, num):
        pass

    def findMedian(self):
        pass`,
      java: `class MedianFinder {
    public MedianFinder() {
        // Write your solution here
    }

    public void addNum(int num) {}

    public double findMedian() {
        return 0.0;
    }
}`
    },
    expectedOutput: {
      javascript: "[null,null,null,1.5,null,2.0]",
      python: "[None,None,None,1.5,None,2.0]",
      java: "[null,null,null,1.5,null,2.0]"
    }
  }
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
  cpp: {
    name: "C++",
    icon: "/cpp.png",
    monacoLang: "cpp",
  },
};