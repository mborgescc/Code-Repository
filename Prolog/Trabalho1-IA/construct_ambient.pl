:- consult(mina.pl).

valor(X,Y,Z):-
	\+ mina(X,Y),
	Z is 0,
	forall((A>=X-1,A=<X+1,B>=Y-1,B=<Y+1,mina(A,B)),Z is Z+1).