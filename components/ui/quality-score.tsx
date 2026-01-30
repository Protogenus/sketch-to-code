'use client'

import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import type { QualityScore } from '@/lib/codeQuality'
import { getGradeColor, getGradeDescription } from '@/lib/codeQuality'

interface QualityScoreDisplayProps {
  score: QualityScore
}

export function QualityScoreDisplay({ score }: QualityScoreDisplayProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getScoreIcon = (grade: string) => {
    switch (grade) {
      case 'A': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'B': return <CheckCircle className="w-5 h-5 text-blue-600" />
      case 'C': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case 'D': return <AlertCircle className="w-5 h-5 text-orange-600" />
      case 'F': return <XCircle className="w-5 h-5 text-red-600" />
      default: return <Info className="w-5 h-5 text-gray-600" />
    }
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    if (value >= 40) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-l-4 border-l-indigo-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getScoreIcon(score.grade)}
              <div>
                <CardTitle className="text-lg">Code Quality Score</CardTitle>
                <CardDescription>{getGradeDescription(score.grade)}</CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getGradeColor(score.grade)}`}>
                {score.overall}
              </div>
              <div className="text-sm text-gray-500">/ 100</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Overall Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Score</span>
              <span className={getGradeColor(score.grade)}>{score.grade}</span>
            </div>
            <Progress value={score.overall} className="h-2" />
          </div>

          {/* Category Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Semantics</span>
                <span className="font-medium">{score.breakdown.semantics}%</span>
              </div>
              <Progress value={score.breakdown.semantics} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Structure</span>
                <span className="font-medium">{score.breakdown.structure}%</span>
              </div>
              <Progress value={score.breakdown.structure} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Styling</span>
                <span className="font-medium">{score.breakdown.styling}%</span>
              </div>
              <Progress value={score.breakdown.styling} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Responsive</span>
                <span className="font-medium">{score.breakdown.responsiveness}%</span>
              </div>
              <Progress value={score.breakdown.responsiveness} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Accessibility</span>
                <span className="font-medium">{score.breakdown.accessibility}%</span>
              </div>
              <Progress value={score.breakdown.accessibility} className="h-1" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Best Practices</span>
                <span className="font-medium">{score.breakdown.bestPractices}%</span>
              </div>
              <Progress value={score.breakdown.bestPractices} className="h-1" />
            </div>
          </div>

          {/* Issues and Suggestions */}
          {(score.issues.length > 0 || score.suggestions.length > 0) && (
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-between">
                  <span>View Details ({score.issues.length + score.suggestions.length} items)</span>
                  <span className="text-xs">{isDetailsOpen ? 'Hide' : 'Show'}</span>
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-4 mt-4">
                {score.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      Issues Found ({score.issues.length})
                    </h4>
                    <div className="space-y-2">
                      {score.issues.map((issue: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-gray-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {score.suggestions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500" />
                      Improvements ({score.suggestions.length})
                    </h4>
                    <div className="space-y-2">
                      {score.suggestions.map((suggestion: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-gray-700">{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Quality Badge */}
          <div className="flex justify-center pt-2">
            <Badge 
              variant="outline" 
              className={`${getGradeColor(score.grade)} border-current`}
            >
              Grade {score.grade} Quality
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
