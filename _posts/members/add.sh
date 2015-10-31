category: people
for f in *; do 
      echo "category: people" > tmpfile
        cat $f >> tmpfile
          mv tmpfile $f
      done
