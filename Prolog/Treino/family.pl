parent(marcia,junior).
parent(mauricio,junior).
parent(mauricio,rafael).
parent(marcia,rafael).
parent(neuza,mauricio).
parent(antonio,mauricio).
parent(neuza,marcio).
parent(neuza,tania).
parent(neuza,regina).
parent(neuza,valeria).
parent(neuza,cristina).
parent(cristina,vanessa).
parent(tania,adriane).
parent(tania,guilherme).
parent(antonio,marcio).
parent(antonio,tania).
parent(antonio,regina).
parent(antonio,valeria).
parent(antonio,cristina).
woman(marcia).
woman(neuza).
woman(valeria).
woman(cristina).
woman(adriane).
woman(regina).
woman(tania).
man(guilherme).
man(marcio).
man(mauricio).
man(junior).
man(rafael).
man(antonio).

mom(X,Y) :-
	parent(X,Y),
	woman(X).
dad(X,Y) :-
	parent(X,Y),
	man(X).
son(X,Y) :-
	parent(Y,X),
	man(X).
daughter(X,Y) :-
	parent(Y,X),
	woman(X).
sibling(X,Y) :-
	dad(Z,X),
	dad(Z,Y),
	X ~= Y.
sibling(X,Y) :-
	mom(Z,X),
	mom(Z,Y).
brother(X,Y) :-
	sibling(X,Y),
	man(X).
sister(X,Y) :-
	sibling(X,Y),
	woman(X).
grandparent(X,Y) :-
	parent(X,Z),
	parent(Z,Y).
grandma(X,Y) :-
	grandparent(X,Y),
	woman(X).
grandpa(X,Y) :-
	grandparent(X,Y),
	man(X).
uncle(X,Y) :-
	sibling(X,Z),
	parent(Z,Y),
	man(X).
aunt(X,Y) :-
	sibling(X,Z),
	parent(Z,Y),
	woman(X).
cousin(X,Y) :-
	parent(Z,X),
	sibling(Z,W),
	parent(W,Y).