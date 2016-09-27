# -*- coding: utf-8 -*-

## Trabalhando com grandes volumes de dados (Big Data) - Trabalho 1
## Aluno: Mauricio Borges Pereira Junior
## DRE: 113028131
## Entrega: xx/09/2016
## Nova Feature para um site

import csv
import matplotlib.pyplot as plt
import numpy as np
from collections import defaultdict, OrderedDict

error_flag = 0

population_average = 0
population_var = 0

population_size = 0

f = csv.reader(open('populacao_tempo.csv'), delimiter=';')

#Calcula média da população
for [identifier, time] in f:
  try:
    population_size += 1
    population_average += time
  except ValueError:
      if error_flag == 1:
         print "Houve um erro de leitura. Favor, verificar."
      error_flag += 1

population_average /= population_size
print ("Média da população: " + str(population_average))

#Calcula variância da população
for [identifier, time] in f:
  try:
    population_var += (time - population_average)**2
  except ValueError:
      if error_flag == 1:
         print "Houve um erro de leitura. Favor, verificar."
      error_flag += 1

population_var /= population_size
print ("Variâmcia da população: " + str(population_average))

## Agora temos os parâmetros da população

#Divide a forca total acumulada pelo numero de pokemons
for info in types:
   types[info] = types[info][0]/types[info][1]

#Coloca em ordem decrescente
types = OrderedDict(sorted(types.items(), key=lambda t: t[1], reverse = True))

#Gera o grafico de barras
n_groups = 5
types_strength = (types.items()[0][1],) + (types.items()[1][1],) + (types.items()[2][1],) + (types.items()[3][1],) + (types.items()[4][1],)
err = (0, 0, 0, 0, 0)
fig, ax = plt.subplots()
index = np.arange(n_groups)
bar_width = 0.70
opacity = 0.4
error_config = {'ecolor': '0.3'}

rects1 = plt.barh(index, types_strength, bar_width,
                 alpha=opacity,
                 color='r',
                 yerr=err,
                 error_kw=error_config)

plt.xlabel('Strength')
plt.ylabel('Types')
plt.title('Top 5 average strength by pokemon type')
plt.yticks(index + bar_width, (types.items()[0][0],) + (types.items()[1][0],) + (types.items()[2][0],) + (types.items()[3][0],) + (types.items()[4][0],))
plt.legend()

plt.tight_layout()
plt.show()