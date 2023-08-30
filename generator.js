const generator = {
  create_sudoku: function(max_number){
    let sudoku = []
    let total_fields = max_number * max_number
    let squareroot = Math.sqrt(max_number)
    let squareheight = Math.floor(squareroot)
    let squarenr = 0
    let square_numbers = []
    let row_numbers = []
    let col_numbers = []
    let i = 0

    let row  = 0
    let col = 0
    let try_number = Math.floor(Math.random()*max_number)+1
    for(i=0;i<max_number;i++){
      col=i
      square_numbers.push([])
      row_numbers.push([])
      col_numbers.push([])
      while(row_numbers[0].indexOf(try_number)>-1)try_number = Math.floor(Math.random()*max_number)+1
      row_numbers[0].push(try_number)
      squarenr = Math.floor(col/squareheight)
      square_numbers[squarenr].push(try_number)
      col_numbers[i].push(try_number)
      sudoku.push(try_number)
    }
    for(i=max_number;i<total_fields;i++){
      row = Math.floor(i / max_number)
      col = i % max_number
      squarenr = Math.floor(row/squareheight)*squareheight + Math.floor(col/squareheight)
      field_possible_numbers = []
      for(let n=1;n<=max_number;n++){
        if(row_numbers[row].indexOf(n)==-1 &&
           col_numbers[col].indexOf(n)==-1 &&
           square_numbers[squarenr].indexOf(n)==-1
         ){
          field_possible_numbers.push(n)
         }
      }
      if(field_possible_numbers.length==0){
        // console.log('missed at', i)
        // console.log('row '+row+':', row_numbers[row],'col'+col+':',col_numbers[col],'square'+squarenr+':',square_numbers[squarenr]);
        // if(!missed[i])missed[i]=1
        // else missed[i]++
        return false;
      }
      try_index = Math.floor(Math.random()*field_possible_numbers.length)
      try_number = field_possible_numbers[try_index]
      sudoku.push(try_number)
      row_numbers[row].push(try_number)
      col_numbers[col].push(try_number)
      square_numbers[squarenr].push(try_number)
    }

    return sudoku
  },
  build_valid_sudokus: function(max_sudokus){
    let badattempts = 0
    let sudokus = []
    let max = max_sudokus * 1000
    for(let i=0;i<max;i++){
      let sudoku = this.create_sudoku(9)
      if(sudoku)sudokus.push(sudoku)
      else badattempts++
      if(sudokus.length>=max_sudokus)break
    }
    return sudokus
  },
  create_target_field_object: function(sudoku, fieldnr){
    //expects a sudoku-solving-object and returns check_field
    let field = {
      nr: fieldnr,
      col: fieldnr % sudoku.max_number,
      row: Math.floor(fieldnr / sudoku.max_number),
    }
    field.square = Math.floor(field.col/sudoku.square_height) + (Math.floor(field.row / sudoku.square_height)*sudoku.square_height)
    return field
  },
  create_solving_object: function(sudoku_array, fieldnr){
    let rows = []
    let cols = []
    let squares = []
    let row = 0
    let col = 0
    let square_number = 0
    let max_number = Math.sqrt(sudoku_array.length)
    let square_height = Math.sqrt(max_number)
    let i = 0
    for(i=0;i<max_number;i++){
      rows.push([])
      cols.push([])
      squares.push([])
    }
    for(i=0;i<sudoku_array.length;i++){
      row = Math.floor(i/max_number)
      col = i % max_number
      square_number = Math.floor(col/square_height) + (Math.floor(row / square_height)*square_height)
      // console.log('square_number',square_number, 'col/row',col,row,'sqh',square_height,'maxnr',max_number);
      rows[row][col]=sudoku_array[i]
      cols[col][row]=sudoku_array[i]
      squares[square_number].push(sudoku_array[i])
    }
    let result = {
      rows:rows,
      cols:cols,
      squares:squares,
      max_number:max_number,
      square_height:square_height,
      solved_list: sudoku_array,
      check_field:{
        nr:fieldnr,
        col: fieldnr % max_number,
        row: Math.floor(fieldnr/max_number),
        expected_result: sudoku_array[fieldnr],
      },
    }
    result.check_field.square = Math.floor(result.check_field.col/square_height) + (Math.floor(result.check_field.row / square_height)*square_height)

    return result
  },
  masquerade_sudoku: function(sudoku_array){
    let try_array=[]
    for(let i=0;i<sudoku_array.length;i++){
      try_array.push(sudoku_array[i])
    }

    //masq one:
    let ind = Math.floor(Math.random()*try_array.length)
    let old_value = try_array[ind]
    try_array[ind]=0
    // console.log('try mask field nr',ind,'with value',old_value);

    let try_nr = this.try_to_solve_field(try_array, ind)
    let masked_fields = 1
    for(let i=0;i<500 && masked_fields < 50 ;i++){
      while (try_array[ind]==0) {
          ind = Math.floor(Math.random()*try_array.length)
      }
      old_value=try_array[ind]
      try_array[ind]=0
      try_nr = this.try_to_solve_field(try_array, ind)
      if(try_nr!=old_value){
        try_array[ind]=old_value
        ind = Math.floor(Math.random()*try_array.length)
        // console.log('masqueradet',i+1,'fields');
        // print_sudoku(try_array)
        // return try_array
      }else{
        masked_fields++
      }
    }
    console.log('masqueradet',masked_fields,'fields');
    return try_array
  },
  try_to_solve_field: function(sudoku_array, fieldnr){
    let sudoku = this.create_solving_object(sudoku_array, fieldnr)
    // console.log();
    // console.log('solving-object',sudoku);
    let pos_numbers = checks.simple(sudoku)
    if(pos_numbers.length==1){
      // console.log('number found',pos_numbers[0]);
      return pos_numbers[0]
    }
    // else if(pos_numbers.length==0){
    //   // console.log('not solvable');
    //   return false
    // }
    pos_numbers = checks.extended_simple(sudoku)
    if(pos_numbers.length==1)return pos_numbers[0]
    //return number for field
  },
  generate_sudokus: function(number){
    let plainsudokus = this.build_valid_sudokus(number)
    let masked_sudokus = []
    for(let m=0;m<plainsudokus.length;m++){
      let s = Date.now()
      masked_sudokus.push(this.masquerade_sudoku(plainsudokus[m]))
      console.log('time needed', Date.now()-s,'ms');
    }
    return masked_sudokus
  },
}

const checks = {
  simple: function(sudoku, check_field){
    let pos_numbers = []
    let field = check_field || sudoku.check_field
    for(let i=1;i<=sudoku.max_number;i++){
      // if(!sudoku.rows[field.row] || !sudoku.cols[field.col] || !sudoku.squares[field.square]){
      //   console.log('field',field);
      //   continue
      // }
      if(sudoku.rows[field.row].indexOf(i)==-1 &&
      sudoku.cols[field.col].indexOf(i)==-1 &&
      sudoku.squares[field.square].indexOf(i)==-1){
        pos_numbers.push(i)
      }
    }
    return pos_numbers
  },
  extended_simple: function(target_sudoku){
    let sudoku = JSON.parse(JSON.stringify(target_sudoku))
    let missing_fields = []
    let i=0
    let num=-1
    let check_field = {}
    let pos_numbers = []
    for(i=0;i<sudoku.solved_list.length;i++){
      if(sudoku.solved_list[i]==0)missing_fields.push(i)
    }
    for(let rounds = 0;rounds<10;rounds++){
      for(i=missing_fields.length-1;i>=0;i--){
        check_field = generator.create_target_field_object(sudoku, missing_fields[i])
        pos_numbers = this.simple(sudoku, check_field)
        if(pos_numbers.length==1){
          if(target_sudoku.check_field.nr == missing_fields[i]){
            return pos_numbers
          }
          num=pos_numbers[0]
          sudoku.rows[check_field.row][check_field.col]=num
          sudoku.cols[check_field.col][check_field.row]=num
          sudoku.squares[check_field.square].push(num)
          sudoku.solved_list[missing_fields[i]]=num
        }
      }
    }
    return false
  },
}

let start = Date.now()
let masked = generator.generate_sudokus(10)
console.log(Date.now()-start,'ms',masked.length,'sudokus');
// console.log(masked);
