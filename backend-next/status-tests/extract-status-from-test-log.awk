BEGIN {
  section=""
  test=""
  result=""
  extract=1

  print "| Section | Test | Status  |"
  print "|:-------:|:----:|:-------:|"
}
( NR >= 6 ) && /^  \w/ && ( extract == 1 ) {
  section=$0
  gsub(/^[[:space:]]+/,"",section)
  gsub(/[[:space:]]+$/,"",section)
}
( NR >= 6 ) && /^    [^\s]/ && ( extract == 1 ) {
  result=($1 == "✔")?"Passed":"Failed"
  $1=""
  test=$0
  gsub(/^[[:space:]]+/,"",test)
  gsub(/[[:space:]]+$/,"",test)

  print "| ",section," | ",test," | ",result," |"
}
/ passing / {
  extract=0
}


