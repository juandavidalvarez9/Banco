const miles = new Intl.NumberFormat('es-CO')

export function pesos(valor) {
  return `${miles.format(valor)} COP`
}
