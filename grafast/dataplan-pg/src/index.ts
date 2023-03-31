import { exportAsMany } from "grafast";

import {
  domainOfCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  isEnumCodec,
  listOfCodec,
  ObjectFromPgCodecAttributes,
  PgBaseCodecsObject,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributes,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgEnumCodecSpec,
  PgRecordTypeCodecSpec,
  rangeOfCodec,
  recordCodec,
  TYPES,
} from "./codecs.js";
import {
  PgBox,
  PgCircle,
  PgHStore,
  PgInterval,
  PgLine,
  PgLseg,
  PgPath,
  PgPoint,
  PgPolygon,
} from "./codecUtils/index.js";
import {
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgFunctionResourceOptions,
  PgRegistryBuilder,
  PgResource,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
} from "./datasource.js";
import {
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  WithPgClient,
} from "./executor.js";
import { BooleanFilterStep } from "./filters/booleanFilter.js";
import { ClassFilterStep } from "./filters/classFilter.js";
import { ManyFilterStep } from "./filters/manyFilter.js";
import { OrFilterStep } from "./filters/orFilter.js";
import {
  KeysOfType,
  MakePgConfigOptions,
  PgClassSingleStep,
  PgCodec,
  PgCodecExtensions,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeColumnSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecPolymorphismUnion,
  PgCodecRelation,
  PgCodecRelationConfig,
  PgCodecRelationExtensions,
  PgCodecWithColumns,
  PgConditionLikeStep,
  PgDecode,
  PgEncode,
  PgEnumCodec,
  PgEnumValue,
  PgGroupSpec,
  PgOrderSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgRegistryAny,
  PgTypedExecutableStep,
  PlanByUniques,
  TuplePlanMap,
} from "./interfaces.js";
import { PgLockableParameter, PgLockCallback } from "./pgLocker.js";
import {
  pgClassExpression,
  PgClassExpressionStep,
} from "./steps/pgClassExpression.js";
import {
  PgConditionCapableParentStep,
  PgConditionStep,
  PgConditionStepExtensions,
  PgHavingConditionSpec,
  PgWhereConditionSpec,
  pgWhereConditionSpecListToSQL,
} from "./steps/pgCondition.js";
import { PgCursorStep } from "./steps/pgCursor.js";
import { pgDelete, PgDeleteStep } from "./steps/pgDelete.js";
import { pgInsert, PgInsertStep } from "./steps/pgInsert.js";
import { pgPageInfo, PgPageInfoStep } from "./steps/pgPageInfo.js";
import {
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
} from "./steps/pgPolymorphic.js";
import {
  digestsFromArgumentSpecs,
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  PgSelectStep,
  sqlFromArgDigests,
} from "./steps/pgSelect.js";
import {
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
} from "./steps/pgSelectSingle.js";
import {
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
} from "./steps/pgSingleTablePolymorphic.js";
import {
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
} from "./steps/pgUnionAll.js";
import { pgUpdate, PgUpdateStep } from "./steps/pgUpdate.js";
import {
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
} from "./steps/pgValidateParsedCursor.js";
import { TempTableStep } from "./steps/tempTable.js";
import { toPg, ToPgStep } from "./steps/toPg.js";
import {
  withPgClient,
  WithPgClientStep,
  WithPgClientStepCallback,
  withPgClientTransaction,
} from "./steps/withPgClient.js";
import { assertPgClassSingleStep } from "./utils.js";

export {
  assertPgClassSingleStep,
  BooleanFilterStep,
  ClassFilterStep,
  digestsFromArgumentSpecs,
  domainOfCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  getInnerCodec,
  isEnumCodec,
  KeysOfType,
  listOfCodec,
  MakePgConfigOptions,
  makePgResourceOptions,
  makeRegistry,
  makeRegistryBuilder,
  ManyFilterStep,
  ObjectFromPgCodecAttributes,
  OrFilterStep,
  PgBaseCodecsObject,
  PgBox,
  PgCircle,
  pgClassExpression,
  PgClassExpressionStep,
  PgClassSingleStep,
  PgClient,
  PgClientQuery,
  PgClientResult,
  PgCodec,
  PgCodecAttribute,
  PgCodecAttributeExtensions,
  PgCodecAttributes,
  PgCodecAttributeVia,
  PgCodecAttributeViaExplicit,
  PgCodecExtensions,
  PgCodecPolymorphism,
  PgCodecPolymorphismRelational,
  PgCodecPolymorphismRelationalTypeSpec,
  PgCodecPolymorphismSingle,
  PgCodecPolymorphismSingleTypeColumnSpec,
  PgCodecPolymorphismSingleTypeSpec,
  PgCodecPolymorphismUnion,
  PgCodecRef,
  PgCodecRefExtensions,
  PgCodecRefPath,
  PgCodecRefPathEntry,
  PgCodecRefs,
  PgCodecRelation,
  PgCodecRelationConfig,
  PgCodecRelationExtensions,
  PgCodecWithColumns,
  PgConditionCapableParentStep,
  PgConditionLikeStep,
  PgConditionStep,
  PgConditionStepExtensions,
  PgCursorStep,
  PgDecode,
  pgDelete,
  PgDeleteStep,
  PgEncode,
  PgEnumCodec,
  PgEnumCodecSpec,
  PgEnumValue,
  PgExecutor,
  PgExecutorContext,
  PgExecutorContextPlans,
  PgExecutorInput,
  PgExecutorMutationOptions,
  PgExecutorOptions,
  PgFunctionResourceOptions,
  PgGroupSpec,
  PgHavingConditionSpec,
  PgHStore,
  pgInsert,
  PgInsertStep,
  PgInterval,
  PgLine,
  PgLockableParameter,
  PgLockCallback,
  PgLseg,
  PgOrderSpec,
  pgPageInfo,
  PgPageInfoStep,
  PgPath,
  PgPoint,
  PgPolygon,
  pgPolymorphic,
  PgPolymorphicStep,
  PgPolymorphicTypeMap,
  PgRecordTypeCodecSpec,
  PgRefDefinition,
  PgRefDefinitionExtensions,
  PgRefDefinitions,
  PgRegistry,
  PgRegistryAny,
  PgRegistryBuilder,
  PgResource,
  PgResourceExtensions,
  PgResourceOptions,
  PgResourceParameter,
  PgResourceUnique,
  PgResourceUniqueExtensions,
  pgSelect,
  PgSelectArgumentDigest,
  PgSelectArgumentSpec,
  pgSelectFromRecord,
  pgSelectFromRecords,
  PgSelectIdentifierSpec,
  PgSelectMode,
  PgSelectOptions,
  PgSelectParsedCursorStep,
  pgSelectSingleFromRecord,
  PgSelectSinglePlanOptions,
  PgSelectSingleStep,
  PgSelectStep,
  pgSingleTablePolymorphic,
  PgSingleTablePolymorphicStep,
  PgTypedExecutableStep,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgUnionAllStepCondition,
  PgUnionAllStepConfig,
  PgUnionAllStepConfigAttributes,
  PgUnionAllStepMember,
  PgUnionAllStepOrder,
  pgUpdate,
  PgUpdateStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  PgWhereConditionSpec,
  pgWhereConditionSpecListToSQL,
  PlanByUniques,
  rangeOfCodec,
  recordCodec,
  sqlFromArgDigests,
  TempTableStep,
  toPg,
  ToPgStep,
  TuplePlanMap,
  TYPES,
  WithPgClient,
  withPgClient,
  WithPgClientStep,
  WithPgClientStepCallback,
  withPgClientTransaction,
};

exportAsMany("@dataplan/pg", {
  assertPgClassSingleStep,
  domainOfCodec,
  getInnerCodec,
  enumCodec,
  getCodecByPgCatalogTypeName,
  isEnumCodec,
  listOfCodec,
  rangeOfCodec,
  recordCodec,
  makeRegistryBuilder,
  makeRegistry,
  makePgResourceOptions,
  TYPES,
  PgResource,
  PgExecutor,
  BooleanFilterStep,
  ClassFilterStep,
  ManyFilterStep,
  OrFilterStep,
  pgClassExpression,
  PgClassExpressionStep,
  PgConditionStep,
  pgWhereConditionSpecListToSQL,
  PgCursorStep,
  pgDelete,
  PgDeleteStep,
  pgInsert,
  PgInsertStep,
  pgPageInfo,
  PgPageInfoStep,
  pgPolymorphic,
  PgPolymorphicStep,
  pgSelect,
  digestsFromArgumentSpecs,
  pgSelectFromRecords,
  PgSelectStep,
  sqlFromArgDigests,
  pgSelectFromRecord,
  pgSelectSingleFromRecord,
  PgSelectSingleStep,
  pgSingleTablePolymorphic,
  pgUnionAll,
  PgUnionAllSingleStep,
  PgUnionAllStep,
  PgSingleTablePolymorphicStep,
  pgUpdate,
  PgUpdateStep,
  pgValidateParsedCursor,
  PgValidateParsedCursorStep,
  TempTableStep,
  toPg,
  ToPgStep,
  withPgClient,
  withPgClientTransaction,
  WithPgClientStep,
});
