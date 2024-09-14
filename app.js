const {
	hook_model,
	init,
	node_dom,
	node_map,
	node,
}=window.lui;

const model={
	init:()=>({
		index: -1,
		points: 0,
		wrongCounter: 0,
		skipCounter: 0,
		squareNumbers:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
	}),
	setIndex: (state,index)=>({
		...state,
		index,
	}),
	randomIndex: state=>({
		...state,
		index: pickItemIndex(state.squareNumbers),
	}),
	addPoint: state=>({
		...state,
		points: state.points+1,
	}),
	addSkip: state=>({
		...state,
		skipCounter: state.skipCounter+1,
	}),
	addWrong: state=>({
		...state,
		wrongCounter: state.wrongCounter+1,
	}),
}

function pickItemIndex(array){
	const random=Math.floor(Math.random()*array.length);
	return Math.min(array.length-1,random);
}

function ViewStudy({points,squareNumber,skip,wrong,actions}){
	return[
		node_dom("h2[innerText=Üben]"),
		node_dom("p",null,[
			node_dom("span",{
				innerText: squareNumber,
				S:{
					color: "red",
				},
			}),
			node_dom("span[innerText= ins Quadrat]"),
		]),
		node_dom("form",{
			onsubmit: event=>{
				const answer=Number(event.target.answer.value);
				event.target.answer.value="";

				if(answer===Math.pow(squareNumber,2)){
					actions.addPoint();
					actions.randomIndex();
				}
				else{
					if(!confirm("Leider Falsch! Erneut Versuchen?")){
						alert("Richtig wäre: "+Math.pow(squareNumber,2)+"\n\n"+squareNumber+" x "+squareNumber+" = "+Math.pow(squareNumber,2));
						actions.addWrong();
						actions.randomIndex();
					}
				}
				return false;
			},
		},[
			node_dom("p",null,[
				node_dom("label[innerText=Antwort: ]",null,[
					node_dom("input[required][autocomplete=off][type=number][autofocus][name=answer]",{
						F: {answerField:true},
					}),
				]),
				node_dom("button[innerText=Überprüfen]"),
				
			]),
		]),
		node_dom("p",null,[
			node_dom("button[innerText=Zurück]",{
				onclick: ()=>{
					actions.addSkip();
					actions.setIndex(-1);
				},
				S:{marginRight:"10px"}
			}),
			node_dom("button[innerText=Überspringen]",{
				onclick: ()=> {
					actions.addSkip();
					actions.randomIndex();
				},
				S:{marginRight:"10px"}
			}),
		]),
		node_dom("p",null,[
			node_dom("span[innerText=Punkte: ]"),
			node_dom("span",{
				S:{color:"green"},
				innerText: points,
			}),
		]),
		node_dom("p",null,[
			node_dom("span[innerText=Übersprungen: ]"),
			node_dom("span",{
				S:{color:"orange"},
				innerText: skip,
			}),
		]),
		node_dom("p",null,[
			node_dom("span[innerText=Falsch: ]"),
			node_dom("span",{
				S:{color:"red"},
				innerText: wrong,
			}),
		]),
	];
}
function SquareNumber({I:squareNumber}){
	return[
		node_dom("p",null,[
			node_dom("span",{
				innerHTML: squareNumber+' <span style="color:green;font-weight:bold;">x</span> '+squareNumber+' = <span style="color:red;font-weight:bold;">'+Math.pow(squareNumber,2)+"</span>",
			}),
		]),
	];
}
function ViewOverview({squareNumbers,actions}){
	return[
		node_dom("h2[innerText=Übersicht]"),
		node_dom("button[innerText=Abfragen!]",{
			onclick: actions.randomIndex,
		}),
		node_map(SquareNumber,squareNumbers),
	];
}

init(()=>{
	const [state,actions]=hook_model(model);

	return[
		node_dom("h1[innerText=Quadrat-Zahlen]"),

		state.index!==-1&&
		node(ViewStudy,{
			squareNumber: state.squareNumbers[state.index],
			points: state.points,
			wrong: state.wrongCounter,
			skip: state.skipCounter,
			actions,
		}),

		state.index===-1&&
		node(ViewOverview,{
			squareNumbers: state.squareNumbers,
			actions,
		}),
	];
});

