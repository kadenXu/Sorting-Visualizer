$(document).ready( function () {
    let num_of_box = 20; // default numbers of boxes.
    let arr = []; // array of boxes - default is empty
    let timeout = 200; // in miliseconds

    // speed controller
    let input = document.querySelector("#speed");
    let log = document.getElementById("speed-value");

    input.addEventListener('input', ()=>{
        let newValue = input.value;
        log.innerHTML = newValue;
        timeout = 200 - newValue*2; // slowest is 400; we subtract each increments from the slowest
    });

    //Size controller 
    let size_input = document.querySelector("#size");
    let size_log = document.querySelector("#size-value");

    size_input.addEventListener('input', ()=>{
        let newValue = size_input.value;
        size_log.innerHTML = newValue;
        num_of_box = newValue;
        resize();
    })

    /* ------------- decorating the boxes on UI -------------- */
    // initialize the array of boxes
    function initialize() { 
        arr = [];
        // create the boxes of the given length
        for (let i = 0; i < num_of_box; i++) {
            arr.push(i);
        }
    }
    // randomize the boxes
    function shuffle() {
        for (let i = 0; i < num_of_box; i++) {
            let j = Math.floor(Math.random() * num_of_box);
            // swap the two elements
            let temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    // the height of all the boxes
    let max = 80;

    function surface () {
        let each = max/num_of_box;
        // clear box first
        clear();
        // display all the boxes in UI
        for (let i = 0; i < num_of_box; i++) {
            let current = arr[i];
            let height = (1+current)*each;
            $(".container").append(`<div class='box' id= 'box${current}' ></div>`);
            $(`#box${current}`).css({"border": "2px solid","background-color":"violet", "flex":"1 1 10px", "height":`${height}vh`});
        }
    }
    // randomize the boxes
    function randomize () {
        //randomize the array
        shuffle();
        surface(); 
    }
    // clear all the boxes
    function clear () {
        $(".box").remove();
    }

    /* ------------ Sorting helper function ---------------- */
    function swapUI(target1, target2) {
        if (target1 == target2) return;
        let div1 = $(`#box${target1}`).clone();
        let div2 = $(`#box${target2}`).clone();
        $(`#box${target1}`).replaceWith(div2);
        $(`#box${target2}`).replaceWith(div1);
    }
    function SwapUI (i, target) { // this must be called before swapEle
        let height1 = $(".box")[i].style.height, height2 = $(".box")[target].style.height;
        $(".box").get(i).style.height = `${height2}`;
        $(".box").get(target).style.height = `${height1}`;
    }
    function swapEle(i, target, min) {
        let temp = arr[i];
            arr[i] = min;
            arr[target] = temp;
    }

    function showSwap(i, target, show) { // show = true, show, or else not show
        let color = "";
        if (show) {
            color = "orange";
        }
        else  color = "violet";
        $(".box")[i].style.backgroundColor = color;
        $(".box")[target].style.backgroundColor = color;
    }

    function waits() {
        return new Promise ((resolve)=> {
            setTimeout(()=>resolve(), timeout);
        });
    }
    /* ------- All sorting algorithms ----------- */
    async function SelectionSort() {
        DisableBtn(true);
        let min = num_of_box;
        for (let i = 0; i < num_of_box; i++) {
            min = arr[i];
            let target = i;
            for (let j = i+1; j < num_of_box; j++) {
                let current = arr[j];
                // check condition - if we find some number smaller than our min
                if (min > current) {
                    min = current;
                    target = j;
                }
            }
            showSwap(i, target, true);
            // then swap two corresponding div elements
            SwapUI(i, target);
            // swap array elements
            swapEle(i, target, min);
            //pause the execution for 0.15 seconds
            await waits();
            showSwap(i, target, false);
        }
        DisableBtn(false);
    }
    async function InsertionSort() {
        DisableBtn(true);
        for (let i = 0; i < num_of_box; i++) {
            let j = i; 
            while (j > 0) {
                if (arr[j] < arr[j-1]) {
                    // show the two elements that get swapped with each other
                    showSwap(j, j-1, true);
                       // surface the swap on the UI
                    SwapUI(j, j-1);
                    // swap the two array elements
                    swapEle(j, j-1, arr[j-1]);
                     // pause for 0.15 second
                    await waits();
                    // back to default...
                     showSwap(j, j-1, false);
                } else {
                    break;
                }
                j--;
            }
        }
        DisableBtn(false);
    }
    async function QuickSort(start, end) {
        DisableBtn(true);
        await Quick_divide(start, end);
        DisableBtn(false);
    }
    async function Quick_divide(start, end) {
        if (start >= end) return;
        let pivot = await Quick_Sort(start, end);
        await Quick_divide(start, pivot-1);
        await Quick_divide(pivot+1, end);
    }
    async function Quick_Sort(start, end) { // helper method: sort the division - Quick Sort
        // find the pivot
        let pivot_index = Pivot(start, end);
        // swap two elements based on the pivot
        SwapUI(start, pivot_index);
        swapEle(start, pivot_index, arr[pivot_index]);
        // set up the required variables
        let left = start+1, right = end;
        let pivot = arr[start];
        let l_move = true, r_move = true;
        // we move one pointer til it fails the condition, then we move the other
        while (left <= right) {
            if (arr[left] < pivot) {
                left++;
                continue;
            }
            else l_move = false;
            if (arr[right] > pivot) {
                right--;
                continue;
            } else {
                r_move = false;
            }
            if (!l_move && !r_move) {
                // both pointers failed the conditions, so we must swap the elements the two pointers pointed at
                showSwap(left, right, true);
                SwapUI(left, right);
                swapEle(left, right, arr[right]);
                await waits();
                showSwap(left, right, false);
            }
        }
        // swap the pivot elements with the element at index left-1
        showSwap(start, left-1, true);
        SwapUI(start, left-1);
        swapEle(start, left-1, arr[left-1]);
        await waits();
        showSwap(start, left-1, false);
        return left-1;
    }
    function Pivot(start, end) {  // helper method: find povit - Quick Sort
        let median = Math.floor((start+end)/2); // 3 4 8
        let one = arr[start], two = arr[median], three = arr[end];
        if (one > two) { // 3 > 2
            if (one < three) return start;
            else if (three > two) return end;
            else return median;
        }// 1 4 5
        else if (one <= two) {
            if (one > three) return start;
            else if (three < two) return end;
            else return median;
        }
        return start;
    }

    async function MergeSort(left, right) {
        DisableBtn(true);
        await Merge_divide(left, right);
        DisableBtn(false);
    }
    async function Merge_divide(left, right) {
        if (left == right) return;
        let mid = Math.floor((left+right)/2);
        await Merge_divide(left, mid);
        await Merge_divide(mid+1, right);
        await Merge_Sort(left, mid, right);
    }
    async function Merge_Sort(left, mid, right) {
        let temp = [];
        let heights = []; // keep track of the height of each that gets inserted
        let l = left, r = mid+1; // two pointers: left, right
        while (l <= mid && r <= right) {
            let element1 = arr[l], element2 = arr[r];
            if (element1 < element2) {
                temp.push(element1);
                heights.push($(".box")[l].style.height);
                l++;
            } else {
                temp.push(element2);
                heights.push($(".box")[r].style.height);
                r++;
            }
        }
        // check non-visited one
        while(l <= mid) {
            temp.push(arr[l]);
            heights.push($(".box")[l].style.height);
            l++;
        }
        while (r <= right) {
            temp.push(arr[r]);
            heights.push($(".box")[r].style.height);
            r++;
        }
        await waits();
        // make changes to the main array
        for (let i = left, j = 0; i <=right; j++,i++) {
            arr[i] = temp[j];
            $(".box")[i].style.height = heights[j];
            // show the changes
            $(".box")[i].style.backgroundColor = "orange";
        }
        await waits();
        // disable display of changes
        for (let i = left; i <= right; i++) {
            $(".box")[i].style.backgroundColor = "violet";
        }
    }

    async function BubbleSort () {
        DisableBtn(true);
        for (let i = 0; i < num_of_box; i++) {
            for (let j = 0; j+1 < num_of_box; j++) {
                if (arr[j+1] < arr[j]) { // need to swap by Bubble Sort principle
                    showSwap(j, j+1, true);
                    await waits();
                    SwapUI(j,j+1);
                    swapEle(j, j+1, arr[j+1]);
                    await waits();
                    showSwap(j, j+1, false);
                }
            }
        }
        DisableBtn(false);
    }

    function DisableBtn(status) {
        $("#randomize").prop("disabled", status);
        $("#size").prop("disabled", status);
        $("#sortBtn").prop("disabled", status);
    }

     // initialize/resize the boxes
    function resize() {
        initialize();
        surface();
    }

     // set randomize on click
    $("#randomize").click(()=> randomize());

    // sorting buttons on click
    let sortType = "";
    let chooseType = (name)=> {
        sortType = name;
        document.querySelector("#title").innerHTML = name;
    }
    $("#SelectionSort").click(()=>chooseType("Selection Sort"));
    $("#InsertionSort").click(()=>chooseType("Insertion Sort"));
    $("#QuickSort").click(()=>chooseType("Quick Sort"));
    $("#MergeSort").click(()=>chooseType("Merge Sort"));
    $("#BubbleSort").click(()=>chooseType("Bubble Sort"));

    // hitting the sort button
    $("#sortBtn").click(()=> {
        switch (sortType) {
            case "Selection Sort":
                SelectionSort();
                break;
            case "Insertion Sort":
                InsertionSort();
                break;
            case "Quick Sort":
                QuickSort(0, num_of_box-1);
                break;
            case "Merge Sort":
                MergeSort(0, num_of_box-1);
                break;
            case "Bubble Sort":
                BubbleSort();
                break;
        }
    });

    // -------------------------------Main Activity--------------------------------------
    resize();

    // ---------- Responsive Design ---------- //
    let screen = window.matchMedia("(max-width: 1000px)");
    mobile(screen);
    screen.addListener(mobile);
    function mobile (screen) {
        if (screen.matches) {
            SortsDropDown();
            adjustDropDown();
            actionDropDown();
            $("#size").attr("max", "50");
        } else {
            $(".AllSortsBtn").css("display", "");
            $(".speed-size").css("display", "");
            $("#action li").css("display", "");
            $("#size").attr("max", "100");
            
        }
    }
    function go () {
        return window.innerWidth <= 1000;
    }
    function SortsDropDown () {
        $(".sorts_type").hover(()=> {
            if (go())
            $(".AllSortsBtn").css("display", "block");
        }, ()=>{
            if (go())
            $(".AllSortsBtn").css("display", "none");
        });
    
    } 
    function adjustDropDown() {
        $("#adjustment").hover(()=> {
            if (go())
            $(".speed-size").css("display", "block");
        }, ()=>{
            if (go())
            $(".speed-size").css("display", "none");
        });
    } 
    function actionDropDown() {
        $("#action").hover(()=> {
            if(go())
            $("#action li").css("display", "block");
        }, ()=>{
            if(go())
            $("#action li").css("display", "none");
        });
    }
});




