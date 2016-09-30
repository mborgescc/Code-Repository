par([]).
par([H|X]):-impar(X).
impar([]).
impar([H|X]):-par(X).