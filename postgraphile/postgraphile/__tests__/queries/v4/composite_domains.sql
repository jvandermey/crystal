select
  __posts__."id"::text as "0",
  __posts__."user_id"::text as "1",
  __frmcdc_user_update_content__."img_url" as "2",
  __frmcdc_user_update_content__."lines"::text as "3",
  (not (__frmcdc_user_update_content__ is null))::text as "4",
  (select json_agg(s) from (
    select
      __frmcdc_user_update_content_2."img_url" as "0",
      __frmcdc_user_update_content_2."lines"::text as "1",
      (not (__frmcdc_user_update_content_2 is null))::text as "2"
    from unnest(__posts__."thread_content") as __frmcdc_user_update_content_2
  ) s) as "5",
  to_char(__posts__."created_at", 'YYYY-MM-DD"T"HH24:MI:SS.USTZH:TZM'::text) as "6"
from "composite_domains"."posts" as __posts__
left outer join lateral (select (__posts__."content").*) as __frmcdc_user_update_content__
on TRUE
order by __posts__."id" asc;

select __frmcdc_user_update_content_line_node_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"composite_domains"."user_update_content_line_node"[] as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_user_update_content_line_node_identifiers__,
lateral (
  select
    __frmcdc_user_update_content_line_node__."line_node_type"::text as "0",
    __frmcdc_user_update_content_line_node__."line_node_text" as "1",
    __frmcdc_user_update_content_line_node_identifiers__.idx as "2"
  from unnest(__frmcdc_user_update_content_line_node_identifiers__."id0") as __frmcdc_user_update_content_line_node__
) as __frmcdc_user_update_content_line_node_result__;

select __frmcdc_user_update_content_line_node_result__.*
from (select ids.ordinality - 1 as idx, (ids.value->>0)::"composite_domains"."user_update_content_line_node"[] as "id0" from json_array_elements($1::json) with ordinality as ids) as __frmcdc_user_update_content_line_node_identifiers__,
lateral (
  select
    __frmcdc_user_update_content_line_node__."line_node_type"::text as "0",
    __frmcdc_user_update_content_line_node__."line_node_text" as "1",
    __frmcdc_user_update_content_line_node_identifiers__.idx as "2"
  from unnest(__frmcdc_user_update_content_line_node_identifiers__."id0") as __frmcdc_user_update_content_line_node__
) as __frmcdc_user_update_content_line_node_result__;