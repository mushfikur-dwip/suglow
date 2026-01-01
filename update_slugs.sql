UPDATE products 
SET slug = CONCAT(
  LOWER(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(
            REPLACE(name, ' ', '-'),
            "'", ''
          ),
          '%', 'percent'
        ),
        '+', 'plus'
      ),
      '.', ''
    )
  ),
  '-', id
)
WHERE slug IS NULL OR slug = '';
