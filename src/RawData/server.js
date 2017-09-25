const XLSX = require('xlsx');
const fs = require('fs');
const _ = require('lodash');


const wb = XLSX.readFile('./data.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws,
    {
        header: ['setType', 'partNumber', 'description', 'material', 'available', 'H', 'L', 'W', 'lordosis', 'qtyInSet'],
        raw: true
    });

const RAW = data
    .filter(o => o.qtyInSet > 0)
    .map(o => {
        o.partNumber += '';         //convert to string
        return o;
    })
    .map(o => {
        delete o.available;         //delete property
        return o;
    })
    .slice(1);                      //delete header row

const STATE = {
    materials: _.sortedUniq(RAW.map(o => o.material)),
    L: _.sortedUniq(_.sortBy(RAW.map(o => o.L))),
    lordosis: _.sortedUniq(_.sortBy(RAW.map(o => o.lordosis))),
    // const _avail = action.raw.map(data => pick(data, ['material', 'L', 'lordosis', 'partNumber', 'description'])),
    avail: _.sortedUniq(
        _.sortBy(RAW.map(data => _.pick(data, ['material', 'L', 'lordosis', 'partNumber', 'description'])),
        ['material', 'L', 'lordosis', 'partNumber', 'description'])
    ),
    requirements: [],    
    raw: RAW
};

initRequirements(STATE);

function initRequirements(state) {
    const _requirements = _.cloneDeep(state.requirements);
    let _index = 0;

    state.requirements = [];
    for (const L of state.L) {
      for (const lordosis of state.lordosis) {
        state.requirements[_index] =
          Object.assign(
            {
              id: _index,
              L: L,
              lordosis: lordosis,
              material: state.avail.some(o => o.material === state.currentMaterial && o.L === L && o.lordosis === lordosis) ?
                state.currentMaterial : this._defaultMaterial,
              partNumber: '',
              description: '',
              avail: state.avail.some(o => o.material === state.currentMaterial && o.L === L && o.lordosis === lordosis),
              availMaterials: _.sortedUniq(state.avail.filter(o => o.L === L && o.lordosis === lordosis).map(avail => avail.material)),
              qty: _requirements[_index] ? _requirements[_index].qty : 0,
              excluded: lordosis === 15 && (L === 18 || L === 26)
            }
          );

        const _avail = state.avail.find(
          avail =>
            avail.material === state.requirements[_index].material &&
            avail.L === state.requirements[_index].L &&
            avail.lordosis === state.requirements[_index].lordosis
        );
        if (_avail) {
          state.requirements[_index].partNumber = _avail.partNumber;
          state.requirements[_index].description = _avail.description;
        }
        _index++;
      }
    }
  }


const serialized = 'export const INIT_STATE = ' + JSON.stringify(STATE, undefined, 2);
console.log(serialized);
fs.writeFile('./data.ts', serialized, 'utf8');
